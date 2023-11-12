# nanopack

A TypeScript implementation of the [NanoPack](https://github.com/poly-gui/nanopack) serialization format.

## Requirements

- [Bun](https://bun.sh) >= 1.0.11

## Generating TypeScript code

`nanoc` supports generating TypeScript code from NanoPack schemas:

```
nanoc --language ts schema1.yaml schema2.yaml ...
```

The generated code imports this library, so please make sure that this library is included in the project that is using the generated code.

## Development

To install all the required dependencies, run

```bash
bun install
```

## Testing

To run all the tests, run:

```bash
bun test
```

---

This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
