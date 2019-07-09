import { ApolloLink, execute, FetchResult, GraphQLRequest, RequestHandler, toPromise } from "apollo-link";
import Observable from "zen-observable-ts";

export type SaturnVRequest<V> = GraphQLRequest & { variables?: V };

export class SaturnVClient {
  private link: ApolloLink;

  constructor(requestHandler: ApolloLink | RequestHandler) {
    this.link = typeof requestHandler === "function" ? new ApolloLink(requestHandler) : requestHandler;
  }

  public getLink(): ApolloLink {
    return this.link;
  }

  public request<T, V>(operation: SaturnVRequest<V>): Observable<FetchResult<T>> {
    return execute(this.link, operation) as Observable<FetchResult<T>>;
  }

  public oneTimeRequest<T, V>(operation: SaturnVRequest<V>): Promise<FetchResult<T>> {
    return toPromise(this.request(operation));
  }
}
