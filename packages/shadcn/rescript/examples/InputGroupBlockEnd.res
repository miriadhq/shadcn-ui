@react.component
let make = () =>
  <Field.Group className="max-w-sm">
    <Field>
      <Field.Label htmlFor="block-end-input"> {"Input"->React.string} </Field.Label>
      <InputGroup className="h-auto">
        <InputGroup.Input id="block-end-input" placeholder="Enter amount" />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd>
          <InputGroup.Text> {"USD"->React.string} </InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
      <Field.Description> {"Footer positioned below the input."->React.string} </Field.Description>
    </Field>
    <Field>
      <Field.Label htmlFor="block-end-textarea"> {"Textarea"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea id="block-end-textarea" placeholder="Write a comment..." />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd>
          <InputGroup.Text> {"0/280"->React.string} </InputGroup.Text>
          <InputGroup.Button dataVariant=InputGroup.Variant.Default dataSize=InputGroup.Size.Sm className="ml-auto">
            {"Post"->React.string}
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
      <Field.Description> {"Footer positioned below the textarea."->React.string} </Field.Description>
    </Field>
  </Field.Group>
