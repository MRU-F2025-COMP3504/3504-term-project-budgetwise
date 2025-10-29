import StatementsPage from "../../FrontEnd/pages/StatementsPage";
import { getStatements } from "../../BackEnd/api/statements";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function Page() {
  const { Transactions } = await getStatements();
  return <StatementsPage statements={Transactions ?? []} />;
}
