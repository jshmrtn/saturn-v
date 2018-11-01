import { ApolloLink } from "apollo-link";
import { expect } from "chai";
import "mocha";
import Observable from "zen-observable-ts";
import { SaturnVClient } from ".";
import { sampleQuery, testClientResults, testResult } from "../test-util";

describe("SaturnVClient", () => {

  describe("getLink", () => {
    it("should normalize a request handler", () => {
      const requestHandler = () => Observable.of();
      const client = new SaturnVClient(requestHandler);
      expect(client.getLink()).to.be.an.instanceof(ApolloLink);
    });

    it("should leave apollo links as is", () => {
      const apolloLink = new ApolloLink(() => Observable.of());
      const client = new SaturnVClient(apolloLink);
      expect(client.getLink()).to.be.equal(apolloLink);
    });
  });

  describe("request", () => {
    it("should relay request and response directly to apollo link", async () => {
      const requestHandler = () => {
        return new Observable((observer) => {
          observer.next(testResult);
          observer.complete();
        });
      };
      const client = new SaturnVClient(requestHandler);

      await testClientResults({ client, results: [testResult] });
    });
  });

  describe("oneTimeRequest", () => {
    it("should relay request and response directly to apollo link", async () => {
      const requestHandler = () => {
        return new Observable((observer) => {
          observer.next("RESULT");
          observer.complete();
        });
      };
      const client = new SaturnVClient(requestHandler);

      await client.oneTimeRequest({ query: sampleQuery });
    });
  });
});
