import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/ws";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect(onConnectCallback) {
    if (this.client && this.client.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("Connected to WebSocket");
        if (onConnectCallback) onConnectCallback();
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"]);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    this.client.activate();
  }



  subscribe(destination, callback) {
    if (!this.client || !this.client.connected) {
      setTimeout(() => this.subscribe(destination, callback), 1000);
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  sendMessage(destination, body) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error("Cannot send message, not connected");
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

const socketService = new WebSocketService();
export default socketService;
