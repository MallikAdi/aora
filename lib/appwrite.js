import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export default config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.adimallikdev.aora",
  projectId: "66ec038f0016b4ae5447",
  databaseId: "66ec0574001bf6a9d183",
  userCollectionId: "66ec057b003812d9fdab",
  videoCollectionId: "66ec05d400052ab819fa",
  storageId: "66ed3699000e53905d4d",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}
