@react.component
let make = () =>
  <div className="grid w-full max-w-md gap-4">
    <InputGroup>
      <InputGroup.Textarea
        id="textarea-code-32" placeholder="console.log('Hello, world!');" className="min-h-[200px]"
      />
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockEnd className="border-t">
        <InputGroup.Text> {"Line 1, Column 1"->React.string} </InputGroup.Text>
        <InputGroup.Button
          dataSize=InputGroup.Size.Sm className="ml-auto" dataVariant=InputGroup.Variant.Default
        >
          {"Run"->React.string}
          <Icons.ArrowRight />
        </InputGroup.Button>
      </InputGroup.Addon>
      <InputGroup.Addon dataAlign=InputGroup.DataAlign.BlockStart className="border-b">
        <InputGroup.Text className="font-mono font-medium">
          <Icons.FileCode />
          {"script.js"->React.string}
        </InputGroup.Text>
        <InputGroup.Button className="ml-auto" dataSize=InputGroup.Size.IconXs>
          <Icons.RefreshCcw />
        </InputGroup.Button>
        <InputGroup.Button dataVariant=InputGroup.Variant.Ghost dataSize=InputGroup.Size.IconXs>
          <Icons.Download />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup>
  </div>
