@@directive("'use client'")

type toLocaleDateStringOpts = {day: string, month: string, year: string}
@send
external toLocaleDateString: (Date.t, string, toLocaleDateStringOpts) => string =
  "toLocaleDateString"
@new external dateFromString: string => Date.t = "Date"
@send external getTime: Date.t => float = "getTime"

let formatDate = (date: option<Date.t>) =>
  switch date {
  | None => ""
  | Some(d) => d->toLocaleDateString("en-US", {day: "2-digit", month: "long", year: "numeric"})
  }

let isValidDate = (d: Date.t) => {
  let t = d->getTime
  !Float.isNaN(t)
}

@react.component
let make = () => {
  let (open_, setOpen) = React.useState(() => false)
  let initialDate = Some(dateFromString("2025-06-01"))
  let (date, setDate) = React.useState(() => initialDate)
  let (month, setMonth) = React.useState(() => initialDate->Option.getOr(Date.make()))
  let (value, setValue) = React.useState(() => formatDate(initialDate))

  <Field className="mx-auto w-48">
    <Field.Label htmlFor="date-required"> {"Subscription Date"->React.string} </Field.Label>
    <InputGroup>
      <InputGroup.Input
        id="date-required"
        value={value}
        placeholder="June 01, 2025"
        onValueChange={(v, _) => {
          let parsed = dateFromString(v)
          setValue(_ => v)
          if parsed->isValidDate {
            setDate(_ => Some(parsed))
            setMonth(_ => parsed)
          }
        }}
      />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <Popover open_={open_} onOpenChange={(v, _) => setOpen(_ => v)}>
          <Popover.Trigger
            render={<InputGroup.Button
              id="date-picker"
              ariaLabel="Select date"
              dataVariant=InputGroup.Variant.Ghost
              dataSize=InputGroup.Size.IconXs
            />}
          >
            <Icons.Calendar />
            <span className="sr-only"> {"Select date"->React.string} </span>
          </Popover.Trigger>
          <Popover.Content
            className="w-auto overflow-hidden p-0"
            align=BaseUi.Types.Align.End
            alignOffset={-8.}
            sideOffset={10.}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={(d: Date.t) => setMonth(_ => d)}
              onSelect={(value: option<Date.t>) => {
                setDate(_ => value)
                setValue(_ => formatDate(value))
                setOpen(_ => false)
              }}
            />
          </Popover.Content>
        </Popover>
      </InputGroup.Addon>
    </InputGroup>
  </Field>
}
