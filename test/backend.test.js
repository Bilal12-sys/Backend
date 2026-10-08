import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import express from "express";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import VerifyToken from "../middleware/VerifyToken.middleware.js";
import upload from "../middleware/upload.js";
import { Product } from "../models/Product.modal.js";
import { User } from "../models/User.modal.js";
import createProductController from "../contraller/product/createProduct.controller.js";
import deleteProductController from "../contraller/product/deleteProduct.controller.js";
import getProductByIdController from "../contraller/product/getProductById.controller.js";
import getProductsController from "../contraller/product/getProducts.controller.js";
import updateProductController from "../contraller/product/updateProduct.controller.js";
import createProduct from "../service/product/createProduct.service.js";
import deleteProduct from "../service/product/deleteProduct.service.js";
import getProductById from "../service/product/getProductById.service.js";
import getProducts from "../service/product/getProducts.service.js";
import updateProduct from "../service/product/updateProduct.service.js";
import ProductRouter from "../routes/upload.route.js";
import {
  formatProduct,
  newProductSchema,
  productIdSchema,
  productSchema,
  Products,
} from "../utils/Products.js";

const VALID_ID = "507f1f77bcf86cd799439011";
const PRODUCT_INPUT = {
  title: "Desk lamp",
  price: 25,
  stock: 4,
  category: "Lighting",
  description: "A desk lamp",
};

const productData = (product) => {
  const { toObject, save, ...data } = product;
  return structuredClone(data);
};

const makeProduct = (data = {}) => ({
  _id: VALID_ID,
  ...PRODUCT_INPUT,
  image: "https://example.com/lamp.jpg",
  cloudinaryId: "my-store/lamp",
  ...data,
  toObject() {
    return productData(this);
  },
});

const makeResponse = () => ({
  statusCode: undefined,
  body: undefined,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const makeRequest = ({ body = {}, params = {}, file } = {}) => ({
  body,
  params,
  file,
});

const makeTemporaryImage = async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "ecommerce-product-test-"));
  const imagePath = path.join(directory, "image.png");
  await fs.writeFile(imagePath, "test image");
  return { directory, imagePath };
};

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

beforeEach(() => {
  Products.length = 0;
});

afterEach(() => {
  Products.length = 0;
});

describe("product schemas and model", () => {
  it("requires valid product fields for creation and converts number strings", () => {
    const result = newProductSchema.validate({
      ...PRODUCT_INPUT,
      price: "25",
      stock: "4",
    });

    assert.equal(result.error, undefined);
    assert.equal(result.value.price, 25);
    assert.equal(result.value.stock, 4);
  });

  it("rejects missing or invalid product fields and unknown keys", () => {
    assert.ok(newProductSchema.validate({ title: "Lamp" }).error);
    assert.ok(productSchema.validate({ stock: -1 }).error);
    assert.ok(productSchema.validate({ price: 0 }).error);
    assert.ok(productSchema.validate({ extraField: true }).error);
  });

  it("validates MongoDB product IDs and formats Mongoose documents", () => {
    assert.equal(productIdSchema.validate(VALID_ID).error, undefined);
    assert.ok(productIdSchema.validate("not-an-id").error);

    const document = makeProduct();
    assert.deepEqual(formatProduct(document), productData(document));
    assert.deepEqual(formatProduct({ title: "Lamp" }), { title: "Lamp" });
  });

  it("defines required product fields and numeric stock in the Mongoose model", () => {
    assert.equal(Product.schema.path("title").isRequired, true);
    assert.equal(Product.schema.path("price").instance, "Number");
    assert.equal(Product.schema.path("stock").instance, "Number");
    assert.equal(Product.schema.path("stock").options.min, 0);
    assert.equal(Product.schema.path("category").instance, "String");
    assert.equal(Product.schema.path("image").isRequired, true);
  });
});

describe("product services", () => {
  it("gets products newest-first", async (t) => {
    const documents = [makeProduct()];
    const query = {
      sort(sortOptions) {
        assert.deepEqual(sortOptions, { createdAt: -1 });
        return Promise.resolve(documents);
      },
    };
    t.mock.method(Product, "find", () => query);

    assert.equal(await getProducts(), documents);
  });

  it("gets a product by a valid ID and rejects an invalid ID", async (t) => {
    const document = makeProduct();
    t.mock.method(Product, "findById", async () => document);

    assert.equal(await getProductById(VALID_ID), document);
    assert.throws(() => getProductById("invalid"), { name: "ValidationError" });
  });

  it("validates create input before uploading an image", async (t) => {
    let uploadCalled = false;
    t.mock.method(cloudinary.uploader, "upload", async () => {
      uploadCalled = true;
      return {};
    });

    await assert.rejects(
      createProduct({ title: "Missing required fields" }, "image.png"),
      /is required/
    );
    assert.equal(uploadCalled, false);
  });

  it("validates update data and delete IDs before accessing MongoDB", async (t) => {
    let databaseCalled = false;
    t.mock.method(Product, "findById", async () => {
      databaseCalled = true;
      return null;
    });
    t.mock.method(Product, "findByIdAndDelete", async () => {
      databaseCalled = true;
      return null;
    });

    await assert.rejects(updateProduct("invalid", {}, undefined));
    await assert.rejects(updateProduct(VALID_ID, { price: -1 }, undefined));
    await assert.rejects(deleteProduct("invalid"));
    assert.equal(databaseCalled, false);
  });

  it("registers all product CRUD routes", () => {
    const routes = ProductRouter.stack
      .filter((layer) => layer.route)
      .map((layer) => [Object.keys(layer.route.methods)[0], layer.route.path]);

    assert.deepEqual(routes, [
      ["get", "/products"],
      ["get", "/products/:id"],
      ["post", "/createproduct"],
      ["put", "/products/:id"],
      ["delete", "/products/:id"],
    ]);
  });

  it("deletes a product image from Cloudinary after deleting its MongoDB record", async (t) => {
    const product = makeProduct();
    let deletedPublicId;
    t.mock.method(Product, "findByIdAndDelete", async () => product);
    t.mock.method(cloudinary.uploader, "destroy", async (publicId) => {
      deletedPublicId = publicId;
      return { result: "ok" };
    });

    assert.equal(await deleteProduct(VALID_ID), product);
    assert.equal(deletedPublicId, product.cloudinaryId);
  });
});

describe("product controllers", () => {
  it("rejects an invalid create request without uploading an image", async (t) => {
    let uploadCalled = false;
    t.mock.method(cloudinary.uploader, "upload", async () => {
      uploadCalled = true;
      return {};
    });

    const response = makeResponse();
    await createProductController(makeRequest({ body: { title: "Lamp" } }), response);

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.success, false);
    assert.equal(uploadCalled, false);
  });

  it("creates a product with a Cloudinary URL and removes its temporary image", async (t) => {
    const { directory, imagePath } = await makeTemporaryImage();
    t.after(() => fs.rm(directory, { recursive: true, force: true }));

    const cloudinaryImage = {
      secure_url: "https://cloudinary.example/lamp.jpg",
      public_id: "my-store/lamp",
    };
    t.mock.method(cloudinary.uploader, "upload", async () => cloudinaryImage);
    t.mock.method(Product, "create", async (data) => makeProduct(data));
    const response = makeResponse();

    await createProductController(
      makeRequest({
        body: PRODUCT_INPUT,
        file: { path: imagePath },
      }),
      response
    );

    assert.equal(response.statusCode, 201);
    assert.equal(response.body.data.image, cloudinaryImage.secure_url);
    assert.equal(response.body.data.cloudinaryId, cloudinaryImage.public_id);
    assert.equal(Products.length, 1);
    assert.equal(Products[0].image, cloudinaryImage.secure_url);
    await assert.rejects(fs.access(imagePath), { code: "ENOENT" });
  });

  it("cleans up a Cloudinary image and the temporary file when MongoDB creation fails", async (t) => {
    const { directory, imagePath } = await makeTemporaryImage();
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    let removedPublicId;
    t.mock.method(cloudinary.uploader, "upload", async () => ({
      secure_url: "https://cloudinary.example/lamp.jpg",
      public_id: "my-store/lamp",
    }));
    t.mock.method(Product, "create", async () => {
      throw new Error("database unavailable");
    });
    t.mock.method(cloudinary.uploader, "destroy", async (publicId) => {
      removedPublicId = publicId;
      return { result: "ok" };
    });
    t.mock.method(console, "error", () => {});
    const response = makeResponse();

    await createProductController(
      makeRequest({ body: PRODUCT_INPUT, file: { path: imagePath } }),
      response
    );

    assert.equal(response.statusCode, 500);
    assert.equal(removedPublicId, "my-store/lamp");
    await assert.rejects(fs.access(imagePath), { code: "ENOENT" });
  });

  it("returns MongoDB products and refreshes the products array", async (t) => {
    const documents = [makeProduct(), makeProduct({ _id: "507f1f77bcf86cd799439012" })];
    const query = { sort: () => Promise.resolve(documents) };
    t.mock.method(Product, "find", () => query);
    const response = makeResponse();

    await getProductsController(makeRequest(), response);

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.total, 2);
    assert.equal(response.body.data, Products);
    assert.equal(Products[0]._id, documents[0]._id);
  });

  it("returns a single product and rejects malformed product IDs", async (t) => {
    const document = makeProduct();
    t.mock.method(Product, "findById", async () => document);
    const successResponse = makeResponse();

    await getProductByIdController(makeRequest({ params: { id: VALID_ID } }), successResponse);
    assert.equal(successResponse.statusCode, 200);
    assert.equal(successResponse.body.data._id, VALID_ID);

    const invalidResponse = makeResponse();
    await getProductByIdController(makeRequest({ params: { id: "bad-id" } }), invalidResponse);
    assert.equal(invalidResponse.statusCode, 400);
  });

  it("returns 404 when a requested product does not exist", async (t) => {
    t.mock.method(Product, "findById", async () => null);
    const response = makeResponse();

    await getProductByIdController(makeRequest({ params: { id: VALID_ID } }), response);

    assert.equal(response.statusCode, 404);
    assert.equal(response.body.message, "Product not found");
  });

  it("updates product fields and keeps the in-memory array synchronized", async (t) => {
    const document = makeProduct({
      async save() {
        return this;
      },
    });
    t.mock.method(Product, "findById", async () => document);
    Products.push(productData(document));
    const response = makeResponse();

    await updateProductController(
      makeRequest({
        params: { id: VALID_ID },
        body: { title: "Updated lamp", stock: "8" },
      }),
      response
    );

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.data.title, "Updated lamp");
    assert.equal(response.body.data.stock, 8);
    assert.equal(Products.length, 1);
    assert.equal(Products[0].title, "Updated lamp");
  });

  it("replaces a product image and removes the old Cloudinary image", async (t) => {
    const { directory, imagePath } = await makeTemporaryImage();
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const document = makeProduct({
      async save() {
        return this;
      },
    });
    const deletedIds = [];
    t.mock.method(Product, "findById", async () => document);
    t.mock.method(cloudinary.uploader, "upload", async () => ({
      secure_url: "https://cloudinary.example/new-lamp.jpg",
      public_id: "my-store/new-lamp",
    }));
    t.mock.method(cloudinary.uploader, "destroy", async (publicId) => {
      deletedIds.push(publicId);
      return { result: "ok" };
    });
    const response = makeResponse();

    await updateProductController(
      makeRequest({
        params: { id: VALID_ID },
        body: {},
        file: { path: imagePath },
      }),
      response
    );

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.data.image, "https://cloudinary.example/new-lamp.jpg");
    assert.deepEqual(deletedIds, ["my-store/lamp"]);
    await assert.rejects(fs.access(imagePath), { code: "ENOENT" });
  });

  it("rejects an empty product update", async () => {
    const response = makeResponse();

    await updateProductController(
      makeRequest({ params: { id: VALID_ID }, body: {} }),
      response
    );

    assert.equal(response.statusCode, 400);
    assert.equal(Products.length, 0);
  });

  it("deletes a product and removes it from the in-memory array", async (t) => {
    const document = makeProduct();
    t.mock.method(Product, "findByIdAndDelete", async () => document);
    t.mock.method(cloudinary.uploader, "destroy", async () => ({ result: "ok" }));
    Products.push(productData(document));
    const response = makeResponse();

    await deleteProductController(makeRequest({ params: { id: VALID_ID } }), response);

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.data._id, VALID_ID);
    assert.equal(Products.length, 0);
  });

  it("returns 404 when deleting a product that does not exist", async (t) => {
    t.mock.method(Product, "findByIdAndDelete", async () => null);
    const response = makeResponse();

    await deleteProductController(makeRequest({ params: { id: VALID_ID } }), response);

    assert.equal(response.statusCode, 404);
  });
});

describe("user model and authentication middleware", () => {
  it("defines required user credentials and a unique email", () => {
    assert.equal(User.schema.path("name").isRequired, true);
    assert.equal(User.schema.path("email").isRequired, true);
    assert.equal(User.schema.path("email").options.unique, true);
    assert.equal(User.schema.path("password").isRequired, true);
  });

  it("rejects missing and malformed authorization tokens", () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";
    const missingResponse = makeResponse();
    VerifyToken({ headers: {} }, missingResponse, () => {
      assert.fail("next should not be called without a token");
    });
    assert.equal(missingResponse.statusCode, 401);

    const malformedResponse = makeResponse();
    VerifyToken({ headers: { authorization: "Bearer" } }, malformedResponse, () => {
      assert.fail("next should not be called without a token");
    });
    assert.equal(malformedResponse.statusCode, 401);

    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it("sets the authenticated user ID from a valid JWT", () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ email: "user@example.com" }, process.env.JWT_SECRET, {
      subject: VALID_ID,
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    let nextCalled = false;

    VerifyToken(req, makeResponse(), () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.deepEqual(req.auth, { userId: VALID_ID });
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it("rejects a token signed with the wrong secret", () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ email: "user@example.com" }, "different-secret", {
      subject: VALID_ID,
    });
    const response = makeResponse();

    VerifyToken(
      { headers: { authorization: `Bearer ${token}` } },
      response,
      () => assert.fail("next should not be called for an invalid token")
    );

    assert.equal(response.statusCode, 401);
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });
});

describe("image upload middleware", () => {
  it("accepts an image, saves it under assets, and rejects a non-image file", async (t) => {
    const app = express();
    app.post("/upload", upload.single("image"), (req, res) => {
      res.status(200).json({ path: req.file.path, filename: req.file.filename });
    });
    app.use((error, req, res, next) => {
      res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
        message: error.message,
      });
    });
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    t.after(async () => closeServer(server));
    const url = `http://127.0.0.1:${server.address().port}/upload`;

    const imageForm = new FormData();
    imageForm.set("image", new Blob(["test image"], { type: "image/png" }), "lamp.png");
    const imageResponse = await fetch(url, { method: "POST", body: imageForm });
    const uploaded = await imageResponse.json();

    assert.equal(imageResponse.status, 200);
    assert.match(uploaded.path, /assets/);
    assert.match(uploaded.filename, /\.png$/);
    await fs.unlink(uploaded.path);

    const textForm = new FormData();
    textForm.set("image", new Blob(["not an image"], { type: "text/plain" }), "notes.txt");
    const textResponse = await fetch(url, { method: "POST", body: textForm });

    assert.equal(textResponse.status, 400);
    assert.equal((await textResponse.json()).message, "Only images are allowed");
  });
});
