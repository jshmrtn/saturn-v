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

  public request(operation: GraphQLRequest): Observable<FetchResult> {
    return execute(this.link, operation);
  }

  public oneTimeRequest(operation: GraphQLRequest): Promise<FetchResult> {
    return toPromise(this.request(operation));
  }
}
