@@directive("'use client'")

@react.component
let make = () => {
  let (isFavorite, setIsFavorite) = React.useState(() => false)

  <div className="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroup.Input placeholder="https://x.com/shadcn" readOnly={true} />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <InputGroup.Button ariaLabel="Copy" dataSize=InputGroup.Size.IconXs>
          <Icons.Download />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup>
    <InputGroup>
      <InputGroup.Input placeholder="Enter your message" />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <InputGroup.Button dataVariant=InputGroup.Variant.Secondary>
          {"Search"->React.string}
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup>
    <InputGroup>
      <InputGroup.Input placeholder="Type to search..." />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <InputGroup.Button onClick={_ => setIsFavorite(f => !f)} dataSize=InputGroup.Size.IconXs>
          <Icons.Info
            dataIcon={isFavorite ? "true" : "false"}
            className="data-[icon=true]:fill-blue-600 data-[icon=true]:stroke-blue-600"
          />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup>
  </div>
}
