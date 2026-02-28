@react.component
let make = () =>
  <div className="flex w-full max-w-xs flex-col gap-6">
    <InputGroup>
      <InputGroup.Input placeholder="Search..." />
      <InputGroup.Addon>
        <Icons.Search />
      </InputGroup.Addon>
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <Kbd> {"⌘"->React.string} </Kbd>
        <Kbd> {"K"->React.string} </Kbd>
      </InputGroup.Addon>
    </InputGroup>
  </div>
