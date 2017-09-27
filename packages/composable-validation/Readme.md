# composable-validation

A [higher-order-component](https://facebook.github.io/react/docs/higher-order-components.html) which removes boilerplate when working with forms in [React](https://facebook.github.io/react/).
 
## Installation

`yarn add composable-validation composable-validation-validators`

## Usage

```typescript
import { required, onlyIf, optional, validate } from 'composable-validation'
import { lessThan, includes, minLength } from 'composable-validation-validators'

type AnimalObject ={
  ant: string,
  bat: number,
  cat: {
    age: number,
    favoriteFoods: Array<string>,
  },
}

// Create your validator by combining validators and combinators
const animalValidator = {
  ant: optional(minLength(6)),
  bat: required(lessThan(10)),
  cat: {
    age: lessThan(6),
    favoriteFoods: includes('fish'),
  }
}

// Validate something

console.log(validate(animalValidator, {
  bat: 24,
  cat: {
    age: 4,
    favoriteFoods: ['cheese'],
  },
}))
// { cat: { age: [ 'Must be at most 6' ] } }


console.log(validate(animalValidator, {
  ant: '12345',
  cat: {
    favoriteFoods: ['fish'],
  },
}))
// { 
//   ant: ['Must be at least 6 in length'],
//   bat: ['Please complete this field'],
//   cat: { 
//     age: ['Please complete this field'],
//     favoriteFoods: ['Must include fish'],
//   }
// }

```