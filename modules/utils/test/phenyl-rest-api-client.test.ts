import assert from "assert";

import { PhenylRestApiClient } from "../src/phenyl-rest-api-client";

// The query and the command share a name so that resolving the command's
// extra result against the query map would also be caught.
type TypeMap = {
  entities: {};
  customQueries: {
    sharedName: { extraResult: { fromQuery: string } };
  };
  customCommands: {
    sharedName: { extraResult: { fromCommand: number } };
  };
  auths: {};
};

class StubClient extends PhenylRestApiClient<TypeMap> {
  async handleRequestData(reqData: any): Promise<any> {
    return {
      type: reqData.method,
      payload: { ok: 1, result: {}, extra: { fromCommand: 1 } },
    };
  }
}

describe("PhenylRestApiClient", () => {
  describe("runCustomCommand", () => {
    it("types extra with the custom command's extraResult", async () => {
      const client = new StubClient();
      const result = await client.runCustomCommand({
        name: "sharedName",
        params: {},
      });

      // Compile-time check: fails if extra is typed as ObjectMap or as the
      // custom query's extraResult.
      const extra: { fromCommand: number } | undefined = result.extra;
      assert.deepStrictEqual(extra, { fromCommand: 1 });
    });
  });
});
