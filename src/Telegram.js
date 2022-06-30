import { Api, TelegramClient } from "telegram";
import { ConnectionTCPObfuscated } from "telegram/network";

const { StringSession } = require("telegram/sessions");
export class Telegram {
  constructor(config) {
    this.apiId = config.apiId;
    this.apiHash = config.apiHash;
    if (config.stringSession == null) {
      this.stringSession = "";
    } else {
      this.stringSession = config.stringSession;
    }

    this.client = new TelegramClient(
      new StringSession(this.stringSession),
      this.apiId,
      this.apiHash,
      {
        connection: ConnectionTCPObfuscated,
      }
    );
  }

  async connect() {
    return this.client.connect();
  }
  async signIn(events) {
    return new Promise(async (resolve) => {
      await this.client.start({
        phoneNumber() {
          return events.onInputPhoneNumber();
        },
        phoneCode(isCodeViaApp) {
          return events.onInputPhoneCode();
        },
        password(hint) {
          return events.onInputPassword();
        },
        onError(err) {
          console.log(err.cause, err.message, err.name, err.stack);
        },
      });

      localStorage.setItem("ishantoken", this.client.session.save());

      resolve("done");
    });
  }

  getAccountDetails() {
    return this.client.getMe();
  }
  getApiIdAndHash() {
    return { apiId: this.apiId, apiHash: this.apiHash };
  }
  async getAllChannel() {
    const result = await this.client.invoke(
      new Api.channels.GetChannels({
        id: ["username"],
      })
    );
    console.log(result);
    return result;
  }

  async getAllAdminChannels() {
    const result = await this.client.invoke(
      new Api.channels.GetGroupsForDiscussion()
    );

    // console.log(result);
    const groups = result?.chats;
    if (groups && groups.length !== 0) {
      const newGroupData = [];
      const keysToCheck = ["id", "title", "username"];
      for (const group of groups) {
        const filteredGroup = Object.keys(group)
          .filter((key) => keysToCheck.includes(key))
          .reduce((obj, key) => {
            obj[key] = group[key];
            return obj;
          }, {});
        // filteredGroup.adminUserId =await checkSession.userId;
        newGroupData.push(filteredGroup);
      }
      return newGroupData;
    }
    return [];
  }

  async makeTheBotAdmin(groupUserName, BOT_USER_NAME, BOT_USER_ID) {
    console.log(BOT_USER_NAME);
    console.log(BOT_USER_ID);

    const result = await this.client.invoke(
      new Api.channels.InviteToChannel({
        channel: groupUserName,
        users: [BOT_USER_NAME],
      })
    );
    console.log(result);
    const data = await this.client.invoke(
      new Api.channels.EditAdmin({
        channel: groupUserName,
        userId: parseInt(BOT_USER_ID),
        adminRights: new Api.ChatAdminRights({
          changeInfo: true,
          postMessages: true,
          editMessages: true,
          deleteMessages: true,
          banUsers: true,
          inviteUsers: true,
          pinMessages: true,
          addAdmins: true,
          anonymous: true,
          manageCall: true,
          other: true,
        }),
        rank: "Admin",
      })
    );
    return data;
  }
  async addImageToGroup(image, channelId) {
    console.log(image);
    const result = await this.client.invoke(
      new Api.channels.EditPhoto({
        channel: "-100" + channelId,
        photo: await this.client.uploadFile({
          file: new CustomFile("TELEGRAM_CHANNEL_PHOTO", 100, undefined, image),
          workers: 1,
        }),
      })
    );
    return result;
  }
}
