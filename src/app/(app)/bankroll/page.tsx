import { BankrollTransactionForm } from "@/components/forms/bankroll-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateCurrentBankroll } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, MetricCard, PageHeader } from "../_components/page-kit";

export default async function BankrollPage() {
  const data = await loadAppData();
  if (data.status !== "ready") {
    return (
      <>
        <PageHeader description="Append-only cash bankroll transaction ledger. Tickets are tracked separately." title="Bankroll ledger" />
        <DataGate data={data} />
      </>
    );
  }

  return (
    <>
      <PageHeader description="Append-only cash bankroll transaction ledger. Tickets are tracked separately." title="Bankroll ledger" />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <MetricCard label="Current bankroll" value={`${data.baseCurrency} ${calculateCurrentBankroll(data.transactions)}`} />
        <MetricCard label="Ledger rows" value={String(data.transactions.length)} />
        <MetricCard label="Open tickets" value={String(data.tickets.filter((ticket) => ticket.status === "available").length)} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Append transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <BankrollTransactionForm baseCurrency={data.baseCurrency} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            {data.transactions.length === 0 ? (
              <EmptyState description="Deposits, withdrawals, tournament buy-ins, returns, fees, bonuses, and adjustments appear here after entry." title="No transactions yet" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Original</TableHead>
                    <TableHead>Base</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.occurred_at.slice(0, 10)}</TableCell>
                      <TableCell><Badge variant="outline">{transaction.type.replaceAll("_", " ")}</Badge></TableCell>
                      <TableCell>{transaction.original_currency} {transaction.original_amount}</TableCell>
                      <TableCell className="font-mono">{transaction.base_currency} {transaction.amount_base}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
