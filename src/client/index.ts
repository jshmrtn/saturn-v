import { ApolloLink, execute, FetchResult, GraphQLRequest, RequestHandler, toPromise } from "apollo-link";
import Observable from "zen-observable-ts";

export class SaturnVClient {
  private link: ApolloLink;

  constructor(requestHandler: ApolloLink | RequestHandler) {
    this.link = typeof requestHandler === "function" ? new ApolloLink(requestHandler) : requestHandler;
  }

  public getLink(): ApolloLink {
    return this.link;
  }

  public request<T>(operation: GraphQLRequest): Observable<FetchResult<T>> {
    return execute(this.link, operation) as Observable<FetchResult<T>>;
  }

  public oneTimeRequest<T>(operation: GraphQLRequest): Promise<FetchResult<T>> {
    return toPromise(this.request(operation));
  }
}
