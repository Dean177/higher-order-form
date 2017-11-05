# composable-validation

[![Npm](https://badge.fury.io/js/composable-validation.svg)](https://www.npmjs.com/package/composable-validation)
[![CircleCI](https://circleci.com/gh/Dean177/with-notification-system.svg?style=svg)](https://circleci.com/gh/Dean177/higher-order-form)
[![Greenkeeper badge](https://badges.greenkeeper.io/Dean177/higher-order-form.svg)](https://greenkeeper.io/)

A declarative and functional way to do validation
 
## Installation

`yarn add composable-validation`

## Usage

```typescript
import { required, onlyIf, optional, validate, ValueValidator } from 'composable-validation'
import { includes } from 'lodash'
import { lessThan, minLength } from 'composable-validation/dist/text'

const includes = <T>(requiredValue: T): ValueValidator<Array<T>> => (values) =>
  includes(values, requiredValue) ? [`Must include ${requiredValue}`] : []

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