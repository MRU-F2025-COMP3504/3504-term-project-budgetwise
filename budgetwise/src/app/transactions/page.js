import TransactionsPage from "../../FrontEnd/pages/TransactionsPage";
import { getTransactions } from "../../BackEnd/api/transactions";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function Page() {
  const { Transactions } = await getTransactions();
  return <TransactionsPage transactions={Transactions ?? []} />;
}
