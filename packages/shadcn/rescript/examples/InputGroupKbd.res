@react.component
let make = () =>
  <InputGroup className="max-w-sm">
    <InputGroup.Input placeholder="Search..." />
    <InputGroup.Addon>
      <Icons.Search className="text-muted-foreground" />
    </InputGroup.Addon>
    <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
      <Kbd> {"⌘K"->React.string} </Kbd>
    </InputGroup.Addon>
  </InputGroup>
