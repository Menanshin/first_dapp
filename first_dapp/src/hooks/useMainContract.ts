import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();  // Получаем sender из useTonConnect
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [contractBalance, setContractBalance] = useState<number | null>(null); // Состояние для баланса

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time)); // Функция для задержки

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });

      const balance = await mainContract.getBalance();  // Получение баланса контракта
      setContractBalance(balance);  // Сохранение баланса в состоянии

      await sleep(5000); // sleep 5 секунд и поллим значение снова
      getValue(); // Рекурсивный вызов getValue
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: contractBalance,
    counter_value: contractData?.counter_value,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);  // Отправка инкремента
    },
  };
}
