import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
  } = useMainContract();
  
  const { connected } = useTonConnect();  

  const handleIncrement = () => {
    if (sendIncrement) {
      sendIncrement();
    } else {
      console.warn("sendIncrement function is not available");
    }
  };

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {/* Кнопка для инкремента */}
        {connected && (
          <a
            onClick={handleIncrement} // Использование обработчика
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Increment
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
