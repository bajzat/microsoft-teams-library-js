import { GlobalVars } from "../internal/globalVars";
import { ensureInitialized, sendMessageRequest } from "../internal/internalAPIs";

/**
 * @private
 * Namespace to interact with bots using the SDK.
 */
export namespace bot {

  /**
 * @private
 * Hide from docs until release.
 * ------
 * Sends query to bot in order to retrieve data.
 * @param botRequest query to send to bot.
 * @param onBotQueryResponse callback to invoke when data is retrieved from bot
 * @param onError callback to invoke should an error occur
 */
  export function sendQuery(botRequest: QueryRequest, onBotQueryResponse?: (data: QueryResponse) => void, onError?: (error: string) => {}): void { // void for now
    ensureInitialized();

    // send request to teams
    const messageId = sendMessageRequest(GlobalVars.parentWindow, "bot.executeQuery", [
      botRequest
    ]);

    // register handler for callback id
    GlobalVars.callbacks[messageId] = (success: boolean, response: string | QueryResponse) => {
      if (success) {
        onBotQueryResponse(response as QueryResponse);
      } else {
        onError(response as string);
      }
    };
  }

  export interface QueryRequest {
    /**
     * Query to search for
     */
    query: string;
  }

  export interface QueryResponse {
    attachments: IAttachment[],
    layout: any;
  }
  export interface IAttachment {
    card: any;
    previewCard: any;
    previewRawPayload: any,
    rawPayload: any;
  }
}