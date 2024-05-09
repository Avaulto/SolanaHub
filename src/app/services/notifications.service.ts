import { Injectable } from '@angular/core';
import { DialectSdk, Dialect, BlockchainSdk, ReadOnlyDapp, DappAddress, DappMessage, BlockchainType, Address, AddressType, Thread, ThreadMemberScope } from '@dialectlabs/sdk';
import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter
} from '@dialectlabs/blockchain-sdk-solana';
import { SolanaHelpersService } from './solana-helpers.service';
import { Keypair } from '@solana/web3.js';
import { DappMessageExtended } from '../models';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _activeDapps = ['SolanaHub','Meteora','AllDomains Notifier', 'Rafffle', 'Tensor', 'Kamino', 'Solana Feature Updates', 'Dialect Notifications', 'Drift', 'Realms', 'Marinade', 'Squads', 'Saber', 'Dialect', 'MonkeDAO', 'Mango']
  private _dialectSDK: DialectSdk<BlockchainSdk>
  constructor(private _shs: SolanaHelpersService) {
    this.createSdk()
  }

  public createSdk() {
    this._dialectSDK = Dialect.sdk(
      {
        environment: 'production',
        dialectCloud: {
          tokenStore: 'local-storage',
          tokenLifetimeMinutes: 43200

        }
      },
      SolanaSdkFactory.create({
        wallet: this._shs.getCurrentWallet() as NodeDialectSolanaWalletAdapter
      }),
    );
    return this._dialectSDK
  }
  public async getSubscribedDapps(): Promise<DappAddress[]> {

    const subs = await this._dialectSDK.wallet.dappAddresses.findAll()

    // const filteredDapps = dapps.filter(d => d.name && d.avatarUrl && this._activeDapps.includes(d.name) && d.blockchainType === 'SOLANA')
    return subs
  }
  public async getDapps(): Promise<ReadOnlyDapp[]> {
    const dapps = await this._dialectSDK.dapps.findAll({
      // verified: true,
    })
    console.log(dapps);
    
    const filteredDapps = dapps.filter(d => d.name && d.avatarUrl && this._activeDapps.includes(d.name) && d.blockchainType === 'SOLANA')
    filteredDapps.sort((x, y) => { return x.name.toLowerCase() === 'solanahub' ? -1 : y.name.toLowerCase() === 'solanahub' ? 1 : 0; });
    return filteredDapps
  }
  public async getMessages(dapps: ReadOnlyDapp[]): Promise<Partial<DappMessageExtended[]>> {
    const sdk1Messages = await this._dialectSDK.wallet.messages.findAllFromDapps({
      // dappVerified: true,
    });
    const extendMessages = sdk1Messages.map(m => {
      const dappData = dapps.find(d => d.address === m.author)
      if (dappData) {
        let type = ''
        switch (dappData.name.toLowerCase()) {
          case "rafffle":
          case "tensor":
          case "magic-eden":
            type = 'NFT'
            break;
          case "realms":
            type = 'DAO'
            break;
          case "meteora":
          case "drift":
          case "saber":
            type = 'Trading'
            break;
          default:
            type = 'Generic'
            break;
        }
        return {type, imgURL: dappData.avatarUrl, name: dappData.name, ...m }
      }
      return m
    })
    console.log(sdk1Messages, 'extended:', extendMessages);
    
    return extendMessages as Partial<DappMessageExtended[]>
  }

  async setupUserSubscription(dappAccountAddress: string): Promise<Thread> {
    // Subscriber subscribes to receive notifications (direct-to-wallet for in-app feed) from dapp.
    // This means first registering an "address" (which can be as simple as a public key, but also
    // an email, phone number, etc.), and then using that address to subscribe for notifications
    // from a project ("dapp").

    // First, we register an address for the user if one hasn't yet been registered.
    const address: Address = await this.getOrCreateAddress();
    console.log(`Subscriber address: ${JSON.stringify(address)}`);

    // Next, we use that address to subscribe for notifications from a dapp.
    const dappAddress: DappAddress = await this.getOrCreateSubscription(address.id, dappAccountAddress);
    console.log(
      `Subscriber is subscribing to dapp address: ${JSON.stringify(dappAddress)}`,
    );

    // Lastly, we create the notifications thread, which is just a one-way
    // messaging thread between the dapp and the subscribing user.
    const notificationsThread: Thread = await this.getOrCreateNotificationsThread(dappAccountAddress);
    console.log(
      `Notifications thread created with id: ${notificationsThread.id}`,
    );
    return notificationsThread;
  }
  async getOrCreateAddress(): Promise<Address> {
    // Register an address

    // See if we have one already
    const addresses: Address[] = await this._dialectSDK.wallet.addresses.findAll();
    const address: Address | null =
      addresses.find((it) => it.type === AddressType.Wallet) ?? null;

    // If not, let's register it
    if (!address) {
      console.log(`Address not found, creating...`);
      const newAddress = this._dialectSDK.wallet.addresses.create({
        value: this._dialectSDK.wallet.address,
        type: AddressType.Wallet,
      });
      console.log(newAddress);
      return newAddress
    }
    return address;
  }


  async getOrCreateSubscription(
    addressId: string,
    dappAccountAddress: string,
  ): Promise<DappAddress> {
    // Subscribe for notifications from a dapp using an address (from function above)

    // Fetch all subscriptions this user's address already has with dapp
    const subscriptions: DappAddress[] = await this._dialectSDK.wallet.dappAddresses.findAll({
      dappAccountAddress: dappAccountAddress,
    });
    console.log(subscriptions);

    // Check if any subscriptions match this address and are subscribed to the
    // "dapp" from above
    // NOTE: DappAddress is effectively a Subscription, and will be renamed to this.
    // For a given Dapp, and a given user's Address, a DappAddress is the entity that
    // manages whether the user has subscribed to receive notifications from that
    // Dapp to that Address.
    const subscription: DappAddress | null =
      subscriptions.find((it) => it.address.id === addressId) ?? null;

    if (!subscription) {
      console.log(`Dapp address not found, creating...`);
      return this._dialectSDK.wallet.dappAddresses.create({
        dappAccountAddress: dappAccountAddress, // The address of the "dapp" sender
        addressId, // The user/subscriber address they'd like to use to subscribe
        enabled: true, // Subscriptions are enableable/disableable. We start by enabling
      });
    }
    return subscription;
  }

  async getOrCreateNotificationsThread(dappAccountAddress: string): Promise<Thread> {
    // Create the notifications thread, through which the user will
    // receive the notifications.

    // First find out if we have one. Like a messaging thread, it is
    // indexed by its members, which in this case is the user and the dapp.
    const notificationThread: Thread | null = await this._dialectSDK.threads.find({
      otherMembers: [dappAccountAddress],
    });

    // If no thread exists, let's create it.
    if (!notificationThread) {
      console.log(`Notification thread not found, creating...`);
      return this._dialectSDK.threads.create({
        encrypted: false,
        me: {
          // Admin scopes let the user manage thread. Note that the user does not have WRITE
          // privileges, since this is a one-way notifications thread.
          scopes: [ThreadMemberScope.ADMIN],
        },
        otherMembers: [
          {
            address: dappAccountAddress,
            // We give the dapp WRITE privileges to send the user notifications in this thread.
            scopes: [ThreadMemberScope.WRITE],
          },
        ],
      });
    }
    return notificationThread;
  }

  async sleep(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
