"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { createBankrollTransaction } from "@/app/actions/bankroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bankrollTransactionSchema } from "@/lib/validation/schemas";
import { ActionMessage, Field } from "./form-parts";

export function BankrollTransactionForm({ baseCurrency = "USD" }: { baseCurrency?: string }) {
  const [state, action, pending] = useActionState(createBankrollTransaction, {});
  const form = useForm({
    resolver: zodResolver(bankrollTransactionSchema),
    defaultValues: {
      amount_base: "",
      base_currency: baseCurrency,
      description: "",
      exchange_rate: "1",
      occurred_at: new Date().toISOString().slice(0, 16),
      original_amount: "",
      original_currency: baseCurrency,
      type: "deposit" as const,
    },
  });

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.type} label="Type" name="type">
        <Select id="type" {...form.register("type")}>
          {["deposit", "withdrawal", "tournament_buy_in", "tournament_return", "ticket_purchase", "ticket_conversion", "adjustment", "fee", "rakeback", "bonus"].map(
            (type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ),
          )}
        </Select>
      </Field>
      <Field error={form.formState.errors.occurred_at} label="Occurred at" name="occurred_at">
        <Input id="occurred_at" type="datetime-local" {...form.register("occurred_at")} />
      </Field>
      <Field error={form.formState.errors.original_amount} label="Original amount" name="original_amount">
        <Input id="original_amount" inputMode="decimal" placeholder="-109.00" {...form.register("original_amount")} />
      </Field>
      <Field error={form.formState.errors.original_currency} label="Original currency" name="original_currency">
        <Input id="original_currency" maxLength={3} {...form.register("original_currency")} />
      </Field>
      <Field error={form.formState.errors.amount_base} label="Base-currency amount" name="amount_base">
        <Input id="amount_base" inputMode="decimal" placeholder="-109.00" {...form.register("amount_base")} />
      </Field>
      <Field error={form.formState.errors.exchange_rate} label="Exchange rate used" name="exchange_rate">
        <Input id="exchange_rate" inputMode="decimal" {...form.register("exchange_rate")} />
      </Field>
      <Field error={form.formState.errors.description} label="Description" name="description">
        <Textarea id="description" className="md:col-span-2" {...form.register("description")} />
      </Field>
      <div className="md:col-span-2">
        <input type="hidden" {...form.register("base_currency")} />
        <Button disabled={pending} type="submit">
          Append transaction
        </Button>
      </div>
    </form>
  );
}
