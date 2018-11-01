import { expect } from "chai";
import gql from "graphql-tag";
import Observable from "zen-observable-ts";
import { SaturnVClient } from "./client";

export interface ClientTestResultType {
  client: SaturnVClient;
  results?: any[];
  query?: string;
  context?: any;
  variables?: any;
}

export const sampleQuery = gql`
  query SampleQuery {
    stub {
      id
    }
  }
`;

export const testResult = {
  data: {
    result: "SUCCESS",
  },
};

export const sampleClient = new SaturnVClient(() => {
  return new Observable((observer) => {
    observer.next(testResult);
    observer.complete();
  });
});

export function testClientResults(params: ClientTestResultType) {
  const { client, context, variables } = params;
  const results = params.results || [];
  const query = params.query || sampleQuery;

  return new Promise((resolve) => {
    client.request({ query, context, variables }).subscribe({
      complete: () => {
        expect(results).to.have.lengthOf(0);
        resolve();
      },
      error: (error) => {
        expect(error).to.equal(results.pop());
        expect(results).to.have.lengthOf(0);
        resolve();
      },
      next: (result) => {
        expect(result).to.equal(results.pop());
      },
    });
  });
}
