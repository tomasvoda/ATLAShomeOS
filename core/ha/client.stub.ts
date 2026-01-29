import { HAConnectionState, HAEntity, HAServiceCall } from './types';

/**
 * Stub implementation of Home Assistant Client.
 * This will later be replaced by actual WebSocket implementation.
 */
export class HAClient {
    private static instance: HAClient;
    private connectionState: HAConnectionState = {
        connected: false,
        authenticated: false,
    };

    private constructor() {
        console.log('[HAClient] Initialized (Stub)');
    }

    public static getInstance(): HAClient {
        if (!HAClient.instance) {
            HAClient.instance = new HAClient();
        }
        return HAClient.instance;
    }

    public async connect(): Promise<void> {
        console.log('[HAClient] Connecting...');
        this.connectionState = { connected: true, authenticated: true };
    }

    public getEntity(entityId: string): HAEntity | undefined {
        // Stub return
        console.log(`[HAClient] getEntity: ${entityId}`);
        return undefined;
    }

    public async callService(call: HAServiceCall): Promise<void> {
        console.log('[HAClient] callService:', call);
    }

    public subscribeEntities(callback: (entities: Record<string, HAEntity>) => void): () => void {
        console.log('[HAClient] Subscribed to entities');
        return () => console.log('[HAClient] Unsubscribed');
    }
}
