"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { createTournamentEntry, upsertTournamentResult } from "@/app/actions/tournaments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { entryMethods, entrySchema, resultSchema } from "@/lib/validation/schemas";
import { ActionMessage, Field } from "./form-parts";

export function EntryForm({ tournamentId }: { tournamentId: string }) {
  const [state, action, pending] = useActionState(createTournamentEntry, {});
  const form = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      add_on: "0.00",
      add_on_base: "0.00",
      amount_paid: "",
      amount_paid_base: "",
      big_blinds_at_entry: "",
      bullet_number: 1,
      entry_method: "direct" as const,
      exchange_rate: "1",
      fee: "0.00",
      fee_base: "0.00",
      planned: true,
      reentry_at: "",
      rule_exception_reason: "",
      stack_at_entry: "",
      ticket_id: "",
      tournament_id: tournamentId,
    },
  });

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <input type="hidden" {...form.register("tournament_id")} />
      <Field error={form.formState.errors.bullet_number} label="Bullet" name="bullet_number">
        <Input id="bullet_number" inputMode="numeric" {...form.register("bullet_number")} />
      </Field>
      <Field error={form.formState.errors.entry_method} label="Entry method" name="entry_method">
        <Select id="entry_method" {...form.register("entry_method")}>
          {entryMethods.map((method) => (
            <option key={method} value={method}>
              {method.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </Field>
      <Field error={form.formState.errors.reentry_at} label="Reentry timestamp" name="reentry_at">
        <Input id="reentry_at" type="datetime-local" {...form.register("reentry_at")} />
      </Field>
      {["amount_paid", "fee", "add_on", "amount_paid_base", "fee_base", "add_on_base"].map((name) => (
        <Field key={name} error={form.formState.errors[name as keyof typeof form.formState.errors]} label={name.replaceAll("_", " ")} name={name}>
          <Input id={name} inputMode="decimal" {...form.register(name as "amount_paid")} />
        </Field>
      ))}
      <Field error={form.formState.errors.exchange_rate} label="Exchange rate" name="exchange_rate">
        <Input id="exchange_rate" inputMode="decimal" {...form.register("exchange_rate")} />
      </Field>
      <Field error={form.formState.errors.stack_at_entry} label="Stack at entry" name="stack_at_entry">
        <Input id="stack_at_entry" inputMode="numeric" {...form.register("stack_at_entry")} />
      </Field>
      <Field error={form.formState.errors.big_blinds_at_entry} label="Big blinds at entry" name="big_blinds_at_entry">
        <Input id="big_blinds_at_entry" inputMode="decimal" {...form.register("big_blinds_at_entry")} />
      </Field>
      <div className="md:col-span-3">
        <Field error={form.formState.errors.rule_exception_reason} label="Rule exception reason" name="rule_exception_reason">
          <Textarea id="rule_exception_reason" {...form.register("rule_exception_reason")} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" defaultChecked {...form.register("planned")} />
        Planned bullet
      </label>
      <div className="md:col-span-3">
        <Button disabled={pending} type="submit">
          Log bullet
        </Button>
      </div>
    </form>
  );
}

export function ResultForm({ tournamentId }: { tournamentId: string }) {
  const [state, action, pending] = useActionState(upsertTournamentResult, {});
  const form = useForm({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      attachment_refs: "",
      bounty_prize: "0.00",
      bounty_prize_base: "0.00",
      bust_out_notes: "",
      duration_minutes: "",
      emotional_state: "",
      final_table: false,
      finishing_position: "",
      normal_prize: "0.00",
      normal_prize_base: "0.00",
      rule_deviation: "",
      total_cash_returned: "0.00",
      total_cash_returned_base: "0.00",
      total_field_size: "",
      tournament_id: tournamentId,
    },
  });

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <input type="hidden" {...form.register("tournament_id")} />
      <Field error={form.formState.errors.finishing_position} label="Finishing position" name="finishing_position">
        <Input id="finishing_position" inputMode="numeric" {...form.register("finishing_position")} />
      </Field>
      <Field error={form.formState.errors.total_field_size} label="Total field size" name="total_field_size">
        <Input id="total_field_size" inputMode="numeric" {...form.register("total_field_size")} />
      </Field>
      <Field error={form.formState.errors.duration_minutes} label="Duration minutes" name="duration_minutes">
        <Input id="duration_minutes" inputMode="numeric" {...form.register("duration_minutes")} />
      </Field>
      {["normal_prize", "bounty_prize", "total_cash_returned", "normal_prize_base", "bounty_prize_base", "total_cash_returned_base"].map((name) => (
        <Field key={name} error={form.formState.errors[name as keyof typeof form.formState.errors]} label={name.replaceAll("_", " ")} name={name}>
          <Input id={name} inputMode="decimal" {...form.register(name as "normal_prize")} />
        </Field>
      ))}
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" {...form.register("final_table")} />
        Final table
      </label>
      <Field error={form.formState.errors.emotional_state} label="Emotional state" name="emotional_state">
        <Input id="emotional_state" {...form.register("emotional_state")} />
      </Field>
      <Field error={form.formState.errors.attachment_refs} label="Attachment refs" name="attachment_refs">
        <Input id="attachment_refs" placeholder="Comma-separated URLs or storage paths" {...form.register("attachment_refs")} />
      </Field>
      <div className="md:col-span-3">
        <Field error={form.formState.errors.rule_deviation} label="Rule deviation" name="rule_deviation">
          <Textarea id="rule_deviation" {...form.register("rule_deviation")} />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Field error={form.formState.errors.bust_out_notes} label="Bust-out notes" name="bust_out_notes">
          <Textarea id="bust_out_notes" {...form.register("bust_out_notes")} />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Button disabled={pending} type="submit">
          Save result
        </Button>
      </div>
    </form>
  );
}
