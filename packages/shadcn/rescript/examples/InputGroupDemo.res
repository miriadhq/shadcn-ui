@react.component
let make = () =>
  <InputGroup className="max-w-xs">
    <InputGroup.Input placeholder="Search..." />
    <InputGroup.Addon>
      <Icons.Search />
    </InputGroup.Addon>
    <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
      {"12 results"->React.string}
    </InputGroup.Addon>
  </InputGroup>
