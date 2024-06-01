import { Injectable, WritableSignal, signal } from '@angular/core';
import { DialectSdk, Dialect, BlockchainSdk, ReadOnlyDapp, DappAddress, DappMessage, BlockchainType, Address, AddressType, Thread, ThreadMemberScope, Dapp } from '@dialectlabs/sdk';
import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter
} from '@dialectlabs/blockchain-sdk-solana';
import va from '@vercel/analytics';
import { SolanaHelpersService } from './solana-helpers.service';
import { Keypair } from '@solana/web3.js';
import { DappMessageExtended } from '../models';
import { LocalStorageService } from './local-storage.service';
import {  Router } from '@angular/router';
import { ToasterService } from './toaster.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _activeDapps = ['SolanaHub', "Texture", 'Meteora','marginfi', 'AllDomains Notifier', 'Rafffle', 'Tensor', 'Kamino', 'Solana Feature Updates', 'Dialect Notifications', 'Drift', 'Realms', 'Marinade', 'Squads', 'Saber', 'Dialect', 'MonkeDAO', 'Mango']
  private _dialectSDK: DialectSdk<BlockchainSdk>
  constructor(
    private _toasterService: ToasterService,
    private _localStorageService: LocalStorageService,
    private _shs: SolanaHelpersService,
    private _router: Router
  ) {

    this.createSdk()
  }
  public walletSubscribedDapps:  WritableSignal<Partial<DappAddress[]>> = signal(null)
  public walletNotifications: WritableSignal<Partial<DappMessageExtended[]>> = signal(null)

  public notifIndicator = signal(null)


  private _updateSDK() {
    try {
      this._dialectSDK = Dialect.sdk(
        {
          environment: 'production',
          dialectCloud: {
            tokenStore: 'local-storage',
            tokenLifetimeMinutes: 43200 // 30 days
          }
        },
        SolanaSdkFactory.create({
          wallet: this._shs.getCurrentWallet() as any
        }),
      );
    } catch (error) {
      console.error(error);

    }
  }
  public createSdk() {
    this._dialectSDK = Dialect.sdk(
      {
        environment: 'production',
        dialectCloud: {
          tokenStore: 'local-storage',
          tokenLifetimeMinutes: 43200 // 30 days
        }
      },
      SolanaSdkFactory.create({
        wallet: NodeDialectSolanaWalletAdapter.create(Keypair.generate())// this._shs.getCurrentWallet() as NodeDialectSolanaWalletAdapter
      }),
    );
    return this._dialectSDK
  }
  public async getSubscribedDapps(): Promise<DappAddress[]> {
    const hasSession = this._localStorageService.getData(`dialect-auth-token-${this._shs.getCurrentWallet().publicKey.toBase58()}`)
    if (!hasSession) {
    this._updateSDK()
    }
    const subs = await this._dialectSDK.wallet.dappAddresses.findAll()
    this.walletSubscribedDapps.set(subs)
    // const filteredDapps = dapps.filter(d => d.name && d.avatarUrl && this._activeDapps.includes(d.name) && d.blockchainType === 'SOLANA')
    return subs
  }
  public dialectDapps: ReadOnlyDapp[] = null
  public async getOrCreateDapps(): Promise<ReadOnlyDapp[]> {
    if (this.dialectDapps) {
      return this.dialectDapps
    } else {

      const dapps = await this._dialectSDK.dapps.findAll({
        verified: true,
      })
      // d.avatarUrl &&
      const filteredDapps = dapps.filter(d => this._activeDapps.includes(d.name) && d.blockchainType === 'SOLANA')
      filteredDapps.sort((x, y) => { return x.name.toLowerCase() === 'solanahub' ? -1 : y.name.toLowerCase() === 'solanahub' ? 1 : 0; });

      this.dialectDapps = filteredDapps;
      return filteredDapps
    }
  }

  // store last notification to calc what is the last read notification.
  private storeLastNotification(notif) {
    this._localStorageService.saveData('lastNotifDate', notif)
  }
  public async checkAndSetIndicator() {
    // check if access key is stored locally 
    const hasSession = this._localStorageService.getData(`dialect-auth-token-${this._shs.getCurrentWallet().publicKey.toBase58()}`)
    if (hasSession) {
      // update SDK to logged pubkey
      this._updateSDK();
      // fetch all messages
      const sdk1Messages = await this._dialectSDK.wallet.messages.findAllFromDapps({
        dappVerified: true,
      });
      this._messages = sdk1Messages

      // set number of messages indicator only if not on notif page
      if (this._router.url !== '/notifications') {
        // get last read message
        const lastMessageDate: Date = JSON.parse(this._localStorageService.getData('lastNotifDate'));
        const unixDate = (timestamp) => Math.floor(new Date(timestamp).getTime() / 1000)
        const unreadMessage = lastMessageDate ? sdk1Messages.filter(m => unixDate(m.timestamp) > unixDate(lastMessageDate)) : sdk1Messages;
        this.notifIndicator.set(unreadMessage.length);
        this.walletNotifications.set(this._messages as any)
      }
    }
  }
  public notifRead() {
    // console.log('store last notif');

    this.storeLastNotification(JSON.stringify(this._messages[0].timestamp))
    this.notifIndicator.set(null)
  }
  private _messages: DappMessage[] = null
  public async getAndSetMessages(dapps: ReadOnlyDapp[]): Promise<void> {

    if (!this._messages) {
      this._messages = await this._dialectSDK.wallet.messages.findAllFromDapps({
        dappVerified: true,
      });
    }
    // extend message data
    const extendMessages = this._messages.map(m => {
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
          case "marginfi":
          case "saber":
          case "texture":
            type = 'Trading'
            break;
          default:
            type = 'Generic'
            break;
        }
        return { type, imgURL: dappData.avatarUrl, name: dappData.name, ...m }
      }
      return m
    })

    console.log(this._messages, 'extended:', extendMessages);
    if (extendMessages.length > 0) {
      this.walletNotifications.set(extendMessages as Partial<DappMessageExtended[]>)
    }

  }

  async setupUserSubscription(dappAccountAddress: string, flag: boolean, appName: string){
    va.track('register to notification', { dapp: appName, subscribe: flag })
    // Subscriber subscribes to receive notifications (direct-to-wallet for in-app feed) from dapp.
    // This means first registering an "address" (which can be as simple as a public key, but also
    // an email, phone number, etc.), and then using that address to subscribe for notifications
    // from a project ("dapp").

    // First, we register an address for the user if one hasn't yet been registered.
    const address: Address = await this.getOrCreateAddress();
    console.log(`Subscriber address: ${JSON.stringify(address)}`);

    // Next, we use that address to subscribe for notifications from a dapp.
    const dappAddress: DappAddress = await this.getOrFlagSubscription(address.id, dappAccountAddress, flag);
    console.log(
      `Subscriber status is:${flag} to dapp address: ${JSON.stringify(dappAddress)}`,
    );

    // Lastly, we create the notifications thread, which is just a one-way
    // messaging thread between the dapp and the subscribing user.
    this.getSubscribedDapps()
    this._toasterService.msg.next({ message: 'subscription preference updated', segmentClass: "toastInfo" })
    if(flag){

      const notificationsThread: Thread = await this.getOrCreateNotificationsThread(dappAccountAddress);
      console.log(
        `Notifications thread created with id: ${notificationsThread.id}`,
      );
      return notificationsThread;
    }

    return null;
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


  // get and enable/disable or create
  async getOrFlagSubscription(
    addressId: string,
    dappAccountAddress: string,
    flag: boolean
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
        enabled: flag, // Subscriptions are enableable/disableable. We start by enabling
      });
    } else {
      console.log(`Dapp ready to update...`, 'flag:', flag);
      return await this._dialectSDK.wallet.dappAddresses.update({
        dappAddressId: subscription.id,
        enabled: flag,
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
