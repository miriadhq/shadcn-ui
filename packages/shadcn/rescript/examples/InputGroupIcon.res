@react.component
let make = () =>
  <div className="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroup.Input placeholder="Search..." />
      <InputGroup.Addon>
        <Icons.Search />
      </InputGroup.Addon>
    </InputGroup>
    <InputGroup>
      <InputGroup.Input type_="email" placeholder="Enter your email" />
      <InputGroup.Addon>
        <Icons.Mail />
      </InputGroup.Addon>
    </InputGroup>
    <InputGroup>
      <InputGroup.Input placeholder="Card number" />
      <InputGroup.Addon>
        <Icons.CreditCard />
      </InputGroup.Addon>
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <Icons.Check />
      </InputGroup.Addon>
    </InputGroup>
    <InputGroup>
      <InputGroup.Input placeholder="Card number" />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
        <Icons.Info />
      </InputGroup.Addon>
    </InputGroup>
  </div>
