import { toPromise } from "apollo-link";
import { expect } from "chai";
import "mocha";
import { compileMutation, compileQuery, compileSubscription } from ".";
import { sampleClient, sampleQuery, testResult } from "../test-util";

describe("compileQuery", () => {
  it("should generate a runable query given a client", async () => {
    const runQuery = compileQuery(sampleQuery, sampleClient);
    expect(await runQuery()).to.equal(testResult);
  });
  it("should generate a non-runable query without a client", async () => {
    const runQuery = compileQuery(sampleQuery);
    expect(await runQuery(sampleClient)).to.equal(testResult);
  });
});

describe("compileMutation", () => {
  it("should generate a runable mutation given a client", async () => {
    const runMutation = compileMutation(sampleQuery, sampleClient);
    expect(await runMutation()).to.equal(testResult);
  });
  it("should generate a non-runable mutation without a client", async () => {
    const runMutation = compileMutation(sampleQuery);
    expect(await runMutation(sampleClient)).to.equal(testResult);
  });
});

describe("compileSubscription", () => {
  it("should generate a runable subscription given a client", async () => {
    const runSubscription = compileSubscription(sampleQuery, sampleClient);
    expect(await toPromise(runSubscription())).to.equal(testResult);
  });
  it("should generate a non-runable subscription without a client", async () => {
    const runSubscription = compileSubscription(sampleQuery);
    expect(await toPromise(runSubscription(sampleClient))).to.equal(testResult);
  });
});
