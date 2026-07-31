"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { recordCsvImport, saveDailyBudget, saveRules, saveSatelliteCampaign, saveSeries } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { budgetSchema, csvImportSchema, rulesSchema, satelliteCampaignSchema, seriesSchema } from "@/lib/validation/schemas";
import { ActionMessage, Field } from "./form-parts";

export function DailyBudgetForm() {
  const [state, action, pending] = useActionState(saveDailyBudget, {});
  const form = useForm({ resolver: zodResolver(budgetSchema), defaultValues: { max_loss_base: "", notes: "", planned_spend_base: "", session_date: "" } });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.session_date} label="Session date" name="session_date"><Input id="session_date" type="date" {...form.register("session_date")} /></Field>
      <Field error={form.formState.errors.planned_spend_base} label="Planned spend" name="planned_spend_base"><Input id="planned_spend_base" inputMode="decimal" {...form.register("planned_spend_base")} /></Field>
      <Field error={form.formState.errors.max_loss_base} label="Max loss" name="max_loss_base"><Input id="max_loss_base" inputMode="decimal" {...form.register("max_loss_base")} /></Field>
      <div className="md:col-span-3"><Field error={form.formState.errors.notes} label="Notes" name="notes"><Textarea id="notes" {...form.register("notes")} /></Field></div>
      <Button disabled={pending} type="submit">Save session budget</Button>
    </form>
  );
}

export function SeriesForm() {
  const [state, action, pending] = useActionState(saveSeries, {});
  const form = useForm({ resolver: zodResolver(seriesSchema), defaultValues: { budget_base: "", end_date: "", name: "", notes: "", platform_or_venue: "", satellite_budget_base: "", start_date: "" } });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.name} label="Series name" name="name"><Input id="name" {...form.register("name")} /></Field>
      <Field error={form.formState.errors.platform_or_venue} label="Platform or venue" name="platform_or_venue"><Input id="platform_or_venue" {...form.register("platform_or_venue")} /></Field>
      <Field error={form.formState.errors.budget_base} label="Series budget" name="budget_base"><Input id="budget_base" inputMode="decimal" {...form.register("budget_base")} /></Field>
      <Field error={form.formState.errors.satellite_budget_base} label="Satellite budget" name="satellite_budget_base"><Input id="satellite_budget_base" inputMode="decimal" {...form.register("satellite_budget_base")} /></Field>
      <Field error={form.formState.errors.start_date} label="Start date" name="start_date"><Input id="start_date" type="date" {...form.register("start_date")} /></Field>
      <Field error={form.formState.errors.end_date} label="End date" name="end_date"><Input id="end_date" type="date" {...form.register("end_date")} /></Field>
      <div className="md:col-span-3"><Field error={form.formState.errors.notes} label="Notes" name="notes"><Textarea id="notes" {...form.register("notes")} /></Field></div>
      <Button disabled={pending} type="submit">Save series</Button>
    </form>
  );
}

export function SatelliteCampaignForm() {
  const [state, action, pending] = useActionState(saveSatelliteCampaign, {});
  const form = useForm({ resolver: zodResolver(satelliteCampaignSchema), defaultValues: { budget_base: "", name: "", notes: "", realized_value_base: "0.00", starts_at: "", total_spend_base: "0.00" } });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.name} label="Campaign name" name="name"><Input id="name" {...form.register("name")} /></Field>
      <Field error={form.formState.errors.starts_at} label="Starts at" name="starts_at"><Input id="starts_at" type="datetime-local" {...form.register("starts_at")} /></Field>
      <Field error={form.formState.errors.budget_base} label="Budget" name="budget_base"><Input id="budget_base" inputMode="decimal" {...form.register("budget_base")} /></Field>
      <Field error={form.formState.errors.total_spend_base} label="Spend to date" name="total_spend_base"><Input id="total_spend_base" inputMode="decimal" {...form.register("total_spend_base")} /></Field>
      <Field error={form.formState.errors.realized_value_base} label="Realized value" name="realized_value_base"><Input id="realized_value_base" inputMode="decimal" {...form.register("realized_value_base")} /></Field>
      <div className="md:col-span-3"><Field error={form.formState.errors.notes} label="Notes" name="notes"><Textarea id="notes" {...form.register("notes")} /></Field></div>
      <Button disabled={pending} type="submit">Save campaign</Button>
    </form>
  );
}

export function RulesForm({ baseCurrency = "USD" }: { baseCurrency?: string }) {
  const [state, action, pending] = useActionState(saveRules, {});
  const form = useForm({
    resolver: zodResolver(rulesSchema),
    defaultValues: {
      base_currency: baseCurrency,
      max_daily_loss_base: "",
      max_daily_spend_base: "",
      max_reentries_per_tournament: 2,
      max_series_budget_base: "",
      min_reserve_bounty: "125",
      min_reserve_freezeout: "100",
      min_reserve_rebuy_add_on: "200",
      min_reserve_reentry: "150",
      min_reserve_satellite: "50",
      mode: "strict" as const,
      name: "Default MTT rules",
      satellite_budget_base: "",
    },
  });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.name} label="Rule set name" name="name"><Input id="name" {...form.register("name")} /></Field>
      <Field error={form.formState.errors.mode} label="Mode" name="mode"><Select id="mode" {...form.register("mode")}><option value="strict">Strict</option><option value="warning_only">Warning only</option></Select></Field>
      <Field error={form.formState.errors.base_currency} label="Base currency" name="base_currency"><Input id="base_currency" maxLength={3} {...form.register("base_currency")} /></Field>
      {["min_reserve_freezeout", "min_reserve_reentry", "min_reserve_rebuy_add_on", "min_reserve_bounty", "min_reserve_satellite", "max_daily_loss_base", "max_daily_spend_base", "max_series_budget_base", "satellite_budget_base"].map((name) => (
        <Field key={name} error={form.formState.errors[name as keyof typeof form.formState.errors]} label={name.replaceAll("_", " ")} name={name}>
          <Input id={name} inputMode="decimal" {...form.register(name as "min_reserve_freezeout")} />
        </Field>
      ))}
      <Field error={form.formState.errors.max_reentries_per_tournament} label="Max reentries" name="max_reentries_per_tournament"><Input id="max_reentries_per_tournament" inputMode="numeric" {...form.register("max_reentries_per_tournament")} /></Field>
      <div className="md:col-span-3"><Button disabled={pending} type="submit">Save rules</Button></div>
    </form>
  );
}

export function CsvImportForm() {
  const [state, action, pending] = useActionState(recordCsvImport, {});
  const form = useForm({ resolver: zodResolver(csvImportSchema), defaultValues: { file_name: "", import_type: "bankroll" as const, row_count: 0 } });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.import_type} label="Import type" name="import_type"><Select id="import_type" {...form.register("import_type")}><option value="bankroll">Bankroll</option><option value="tournaments">Tournaments</option><option value="entries">Entries</option><option value="results">Results</option><option value="tickets">Tickets</option></Select></Field>
      <Field error={form.formState.errors.file_name} label="File name" name="file_name"><Input id="file_name" {...form.register("file_name")} /></Field>
      <Field error={form.formState.errors.row_count} label="Validated row count" name="row_count"><Input id="row_count" inputMode="numeric" {...form.register("row_count")} /></Field>
      <Button disabled={pending} type="submit">Record import</Button>
    </form>
  );
}
