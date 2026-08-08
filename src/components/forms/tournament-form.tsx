"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { createTournament } from "@/app/actions/tournaments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { simpleTournamentLogSchema, tournamentFormats, tournamentSpeeds } from "@/lib/validation/schemas";
import { ActionMessage, Field } from "./form-parts";

export function TournamentForm({ baseCurrency = "USD" }: { baseCurrency?: string }) {
  const [state, action, pending] = useActionState(createTournament, {});
  const form = useForm({
    resolver: zodResolver(simpleTournamentLogSchema),
    defaultValues: {
      base_buy_in: "",
      currency: baseCurrency,
      fee: "0.00",
      field_size: "",
      flight: "",
      format: "freezeout" as const,
      guarantee: "",
      finishing_position: "",
      late_registration_open: false,
      location_type: "online" as const,
      name: "",
      notes: "",
      platform_or_venue: "",
      speed: "regular" as const,
      starting_big_blinds: "",
      starting_stack: "",
      starts_at: new Date().toISOString().slice(0, 16),
      total_cash_returned: "",
    },
  });

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <ActionMessage {...state} />
      <Field error={form.formState.errors.name} label="Tournament name" name="name">
        <Input id="name" {...form.register("name")} />
      </Field>
      <Field error={form.formState.errors.platform_or_venue} label="Platform or venue" name="platform_or_venue">
        <Input id="platform_or_venue" {...form.register("platform_or_venue")} />
      </Field>
      <Field error={form.formState.errors.starts_at} label="Start date and time" name="starts_at">
        <Input id="starts_at" type="datetime-local" {...form.register("starts_at")} />
      </Field>
      <Field error={form.formState.errors.location_type} label="Live or online" name="location_type">
        <Select id="location_type" {...form.register("location_type")}>
          <option value="online">Online</option>
          <option value="live">Live</option>
        </Select>
      </Field>
      <Field error={form.formState.errors.format} label="Format" name="format">
        <Select id="format" {...form.register("format")}>
          {tournamentFormats.map((format) => (
            <option key={format} value={format}>
              {format.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </Field>
      <Field error={form.formState.errors.speed} label="Speed" name="speed">
        <Select id="speed" {...form.register("speed")}>
          {tournamentSpeeds.map((speed) => (
            <option key={speed} value={speed}>
              {speed}
            </option>
          ))}
        </Select>
      </Field>
      <Field error={form.formState.errors.base_buy_in} label="Base buy-in" name="base_buy_in">
        <Input id="base_buy_in" inputMode="decimal" {...form.register("base_buy_in")} />
      </Field>
      <Field error={form.formState.errors.fee} label="Fee" name="fee">
        <Input id="fee" inputMode="decimal" {...form.register("fee")} />
      </Field>
      <Field error={form.formState.errors.currency} label="Currency" name="currency">
        <Input id="currency" maxLength={3} {...form.register("currency")} />
      </Field>
      <Field error={form.formState.errors.total_cash_returned} label="Cash returned" name="total_cash_returned">
        <Input id="total_cash_returned" inputMode="decimal" placeholder="Leave blank until finished" {...form.register("total_cash_returned")} />
      </Field>
      <Field error={form.formState.errors.finishing_position} label="Finish position" name="finishing_position">
        <Input id="finishing_position" inputMode="numeric" placeholder="Optional" {...form.register("finishing_position")} />
      </Field>
      <Field error={form.formState.errors.guarantee} label="Guarantee" name="guarantee">
        <Input id="guarantee" inputMode="decimal" {...form.register("guarantee")} />
      </Field>
      <Field error={form.formState.errors.field_size} label="Field size" name="field_size">
        <Input id="field_size" inputMode="numeric" {...form.register("field_size")} />
      </Field>
      <Field error={form.formState.errors.starting_stack} label="Starting stack" name="starting_stack">
        <Input id="starting_stack" inputMode="numeric" {...form.register("starting_stack")} />
      </Field>
      <Field error={form.formState.errors.starting_big_blinds} label="Starting big blinds" name="starting_big_blinds">
        <Input id="starting_big_blinds" inputMode="decimal" {...form.register("starting_big_blinds")} />
      </Field>
      <Field error={form.formState.errors.flight} label="Flight" name="flight">
        <Input id="flight" {...form.register("flight")} />
      </Field>
      <label className="flex items-center gap-2 self-end text-sm text-muted-foreground">
        <input type="checkbox" {...form.register("late_registration_open")} />
        Late registration open
      </label>
      <div className="md:col-span-3">
        <Field error={form.formState.errors.notes} label="Notes" name="notes">
          <Textarea id="notes" {...form.register("notes")} />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Button disabled={pending} type="submit">
          Save tournament and view stats
        </Button>
      </div>
    </form>
  );
}
