@react.component
let make = () =>
  <Field.Group>
    <Field>
      <Field.Label htmlFor="textarea-header-footer-12">
        {"Default Textarea (No Input Group)"->React.string}
      </Field.Label>
      <Textarea id="textarea-header-footer-12" placeholder="Enter your text here..." />
    </Field>
    <Field>
      <Field.Label htmlFor="textarea-header-footer-13"> {"Input Group"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea id="textarea-header-footer-13" placeholder="Enter your text here..." />
      </InputGroup>
      <Field.Description>
        {"This is a description of the input group."->React.string}
      </Field.Description>
    </Field>
    <Field dataInvalid={true}>
      <Field.Label htmlFor="textarea-header-footer-14"> {"Invalid"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea id="textarea-header-footer-14" placeholder="Enter your text here..." />
      </InputGroup>
      <Field.Description>
        {"This is a description of the input group."->React.string}
      </Field.Description>
    </Field>
    <Field dataDisabled={true}>
      <Field.Label htmlFor="textarea-header-footer-15"> {"Disabled"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea
          id="textarea-header-footer-15" placeholder="Enter your text here..." disabled={true}
        />
      </InputGroup>
      <Field.Description>
        {"This is a description of the input group."->React.string}
      </Field.Description>
    </Field>
    <Field>
      <Field.Label htmlFor="prompt-31"> {"Addon (block-start)"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea id="prompt-31" />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockStart>
          <InputGroup.Text> {"Ask, Search or Chat..."->React.string} </InputGroup.Text>
          <Icons.Info className="text-muted-foreground ml-auto" />
        </InputGroup.Addon>
      </InputGroup>
      <Field.Description>
        {"This is a description of the input group."->React.string}
      </Field.Description>
    </Field>
    <Field>
      <Field.Label htmlFor="textarea-header-footer-30">
        {"Addon (block-end)"->React.string}
      </Field.Label>
      <InputGroup>
        <InputGroup.Textarea id="textarea-header-footer-30" placeholder="Enter your text here..." />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd>
          <InputGroup.Text> {"0/280 characters"->React.string} </InputGroup.Text>
          <InputGroup.Button
            dataVariant=InputGroup.Variant.Default
            dataSize=InputGroup.Size.IconXs
            className="ml-auto rounded-full"
          >
            <Icons.ArrowUp />
            <span className="sr-only"> {"Send"->React.string} </span>
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </Field>
    <Field>
      <Field.Label htmlFor="textarea-comment-31"> {"Addon (Buttons)"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea
          id="textarea-comment-31" placeholder="Share your thoughts..." className="min-h-[120px]"
        />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd>
          <InputGroup.Button
            dataVariant=InputGroup.Variant.Ghost className="ml-auto" dataSize=InputGroup.Size.Sm
          >
            {"Cancel"->React.string}
          </InputGroup.Button>
          <InputGroup.Button dataVariant=InputGroup.Variant.Default dataSize=InputGroup.Size.Sm>
            {"Post Comment"->React.string}
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup>
    </Field>
    <Field>
      <Field.Label htmlFor="textarea-code-32"> {"Code Editor"->React.string} </Field.Label>
      <InputGroup>
        <InputGroup.Textarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-[300px] py-3"
        />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockStart className="border-b">
          <InputGroup.Text className="font-mono font-medium">
            <Icons.FileCode />
            {"script.js"->React.string}
          </InputGroup.Text>
          <InputGroup.Button dataSize=InputGroup.Size.IconXs className="ml-auto">
            <Icons.RefreshCcw />
          </InputGroup.Button>
          <InputGroup.Button dataSize=InputGroup.Size.IconXs dataVariant=InputGroup.Variant.Ghost>
            <Icons.Download />
          </InputGroup.Button>
        </InputGroup.Addon>
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd className="border-t">
          <InputGroup.Text> {"Line 1, Column 1"->React.string} </InputGroup.Text>
          <InputGroup.Text className="ml-auto"> {"JavaScript"->React.string} </InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
    </Field>
  </Field.Group>
