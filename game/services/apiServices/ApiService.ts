export type globalType = {
    ApiConsumerInstance?: ApiConsumer;
};

class ApiConsumer {
  url: string = "/api/db/";
  login: string = "login";
  signin: string = "signin";
  save: string = "save";
  saveToken: string = "";

  loginUser(ssoToken: string) {
    return fetch(`${this.url}${this.login}/${ssoToken}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  saveUser(progress: any) {
    if(!this.saveToken) return null;
    return fetch(`${this.url}${this.save}/${this.saveToken}`, {
      method: "POST",
      body: JSON.stringify(progress),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  setSaveToken(saveToken: string) {
    this.saveToken = saveToken;
  }

}



let ApiConsumerSingleton;
if (!(global as globalType).ApiConsumerInstance)
  ApiConsumerSingleton = new ApiConsumer();
else ApiConsumerSingleton = (global as globalType).ApiConsumerInstance;
export default ApiConsumerSingleton as ApiConsumer;
