import { optional, required, rules, valid } from 'composable-validation'
import { maxValue } from 'composable-validation/dist/validators/number'
import { maxLength, minLength } from 'composable-validation/dist/validators/text'
import * as React from 'react'
import * as CodeMirror from 'react-codemirror'
import { FormProps, withForm } from 'with-form'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import './App.css'

require('codemirror/mode/javascript/javascript')
require('codemirror/mode/jsx/jsx')

type ErrorBoundaryState = { error: Error | null, info: React.ErrorInfo | null }
class DevErrorBoundary extends React.Component<{ className: string }, ErrorBoundaryState> {
  state = { error: null, info: null }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info })
  }
  render() {
    if (this.state.error != null) {
      return (
        <div className="ErrorBoundary">
          <h2>Error</h2>
          <p>
            If you are seeing this please create an issue on{' '}
            <a href="https://github.com/Dean177/with-notification-system/issues">Github</a> which includes the following
            information:
          </p>
          <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
          <h2>Component</h2>
          <pre>{(this.state.info! as React.ErrorInfo).componentStack}</pre>
        </div>
      )
    }

    return (<div className={this.props.className}>{this.props.children}</div>)
  }
}

const SyntaxHighlight = (props: { mode?: { name: string }, code: string }) => (
  <CodeMirror
    options={{ mode: props.mode || { name: 'jsx', base: { name: 'javascript', typescript: true }}, theme: 'monokai' }}
    value={props.code}
  />
)

type BasicFormModel = {
  booleanField: boolean,
  stringField: string,
  numericField: number | string,
}

type BasicFormProps = FormProps<BasicFormModel>

const enhance = withForm<{}, BasicFormModel>({
  initialValues: (): BasicFormModel => ({
    booleanField: false,
    stringField: '',
    numericField: '',
  }),
  onSubmit: () => (formValues: BasicFormModel) => {
    alert(JSON.stringify(formValues))
  },
})

const BasicFormExample = enhance((props: BasicFormProps) => (
  <div className="FormExample">
    <form onSubmit={props.form.submit}>
      <h4>Basic form</h4>
      <label>Boolean field</label>
      {props.form.controlFor.booleanField(<input type="checkbox" />)}

      <label>String field</label>
      {props.form.controlFor.stringField(<input />)}

      <label>Numeric field</label>
      {props.form.controlFor.numericField(<input type="number" />)}

      <button type="submit" onClick={props.form.submit}>Submit</button>
    </form>
    <div className="state">
      <h5>Values</h5>
      <pre>{JSON.stringify(props.form.values, null, 2)}</pre>
    </div>
  </div>
))

type ValidatedFormModel = {
  booleanField: boolean,
  numericField: React.ReactText,
  optionalStringField: string,
  stringField: string,
}

type ValidatedOwnProps = { numberProp: number, booleanProp: boolean }

type ValidatedFormProps = ValidatedOwnProps & FormProps<ValidatedFormModel>

const validatedEnhance = withForm<ValidatedOwnProps, ValidatedFormModel>({
  initialValues: (props: ValidatedOwnProps): ValidatedFormModel => ({
    booleanField: props.booleanProp,
    numericField: '',
    optionalStringField: '',
    stringField: '',
  }),
  validator: (props: ValidatedOwnProps) => (formValues: ValidatedFormModel) => ({
    numericField: (val: React.ReactText) =>
      Number(val) >= props.numberProp ? [`Must be less than ${props.numberProp}`] : valid,
    optionalStringField: optional(maxLength(props.numberProp)),
    stringField: required(
      rules(maxLength(200), minLength(3)),
    ),
  }),
  onSubmit: (props: ValidatedOwnProps) => (formValues: ValidatedFormModel) => {
    alert(JSON.stringify(formValues))
  },
})

const ValidatedFormExample: React.ComponentType<ValidatedOwnProps> = validatedEnhance((props: ValidatedFormProps) => (
  <div className="FormExample">
    <form onSubmit={props.form.submit}>
      <h4>Validated form</h4>
      <label>Boolean field</label>
      {props.form.controlFor.booleanField(<input type="checkbox" />)}

      <label>String field</label>
      {props.form.controlFor.stringField(<input />)}

      <label>Optional string field</label>
      {props.form.controlFor.optionalStringField(<textarea rows={3} />)}

      <label>Numeric field</label>
      {props.form.controlFor.numericField(<input type="number" />)}

      <button type="submit" onClick={props.form.submit}>Submit</button>
    </form>
    <div className="state">
      <h5>Values</h5>
      <pre>{JSON.stringify(props.form.values, null, 2)}</pre>
      <h5>Validation errors</h5>
      <pre>{JSON.stringify(props.form.validationErrors, null, 2)}</pre>
    </div>
  </div>
))

export const App = () => (
  <DevErrorBoundary className="App">
    <div className="App-header">
      <h1>with-form</h1>
    </div>
    <div className="content">
      <div className="status-icons github-buttons">
        <a
          className="status-icon github-button"
          href="https://github.com/dean177/higher-order-form"
          data-size="mega"
          data-icon="octicon-star"
          data-count-href="/dean177/higher-order-form/stargazers"
          data-show-count="true"
          data-count-aria-label="# stargazers on GitHub"
          aria-label="Star dean177/higher-order-form on GitHub"
        >
          Star
        </a>
        <a className="status-icon" href="https://circleci.com/gh/Dean177/higher-order-form">
          <img src="https://circleci.com/gh/Dean177/higher-order-form.svg?style=svg" />
        </a>
        <a className="status-icon" href="https://www.npmjs.com/package/with-form">
          <img src="https://badge.fury.io/js/with-form.svg" alt="npm version" height="18" />
        </a>
      </div>
      <h2>Installation</h2>
      <p>Install the dependencies</p>
      <SyntaxHighlight code={`yarn install with-form`} mode={{ name: 'shell' }} />

      <p>Or via npm</p>
      <SyntaxHighlight code={`npm install --save with-form`} mode={{ name: 'shell' }} />

      <section>
        <h2>Usage</h2>
        <p>Create a type represent your form</p>
        <SyntaxHighlight
          code={`
  type BasicFormModel = {
    booleanField: boolean,
    stringField: string,
    numericField: number | string,
  }
          `}
        />
  
        <p>Decide what the initial values should be and provide callback for form submission</p>
        <SyntaxHighlight
          code={`
  const enhance = withForm<{}, BasicFormModel>({
    initialValues: (): BasicFormModel => ({
      booleanField: false,
      stringField: '',
      numericField: '',
    }),
    onSubmit: () => (formValues: BasicFormModel) => {
      alert(JSON.stringify(formValues))
    },
  })
          `}
        />
  
        <p>Wire up some UI</p>
        <SyntaxHighlight
          code={`
  const BasicFormExample = enhance((props: BasicFormProps) => (
    <form onSubmit={props.form.submit}>
      <h4>Basic form</h4>
      <label>Boolean field</label>
      {props.form.controlFor.booleanField(<input type="checkbox" />)}
  
      <label>String field</label>
      {props.form.controlFor.stringField(<input />)}
  
      <label>Numeric field</label>
      {props.form.controlFor.numericField(<input type="number" />)}
  
      <button type="submit" onClick={props.form.submit}>Submit</button>
    </form>
  )
          `}
        />
  
        <p>And here is what it looks like, try entering some data and submitting the form</p>
  
        <BasicFormExample />
      </section>

      <section>
        <h2>Validation</h2>
        <p>Lets add some validation to prevent an invalid form submission. Lets start with some types</p>
        <SyntaxHighlight
          code={`
  type ValidatedFormModel = {
    booleanField: boolean,
    numericField: React.ReactText,
    optionalStringField: string,
    stringField: string,
  }

  type ValidatedOwnProps = { numberProp: number, booleanProp: boolean }

  type ValidatedFormProps = ValidatedOwnProps & FormProps<ValidatedFormModel>
          `}
        />
        <p>
          With form uses{' '}
          <a href="https://github.com/Dean177/higher-order-form/tree/master/packages/composable-validation">
            composable-validation
          </a>
          {' '}for its validation needs. Lets create a validator for our type.
        </p>
        <SyntaxHighlight
          code={`

  const validatedEnhance = withForm<ValidatedOwnProps, ValidatedFormModel>({
    initialValues: (props: ValidatedOwnProps): ValidatedFormModel => ({
      booleanField: props.booleanProp,
      numericField: '',
      optionalStringField: '',
      stringField: '',
    }),
    validator: (props: ValidatedOwnProps) => (formValues: ValidatedFormModel) => ({
      numericField: (val: React.ReactText) =>
        Number(val) >= props.numberProp ? [${'`Must be less than ${props.numberProp}`'}] : valid,
      optionalStringField: optional(maxLength(props.numberProp)),
      stringField: required(
        rules(maxLength(200), minLength(3)),
      ),
    }),
    onSubmit: (props: ValidatedOwnProps) => (formValues: ValidatedFormModel) => {
      alert(JSON.stringify(formValues))
    },
  })
          `}
        />

        <p>And add in some UI</p>
        <SyntaxHighlight
          code={`
  const ValidatedFormExample: React.ComponentType<ValidatedOwnProps> = validatedEnhance((props: ValidatedFormProps) => (
    <div className="FormExample">
      <form onSubmit={props.form.submit}>
        <h4>Validated form</h4>
        <label>Boolean field</label>
        {props.form.controlFor.booleanField(<input type="checkbox" />)}

        <label>String field</label>
        {props.form.controlFor.stringField(<input />)}

        <label>Optional string field</label>
        {props.form.controlFor.optionalStringField(<textarea rows={3} />)}

        <label>Numeric field</label>
        {props.form.controlFor.numericField(<input type="number" />)}

        <button type="submit" onClick={props.form.submit}>Submit</button>
      </form>
      <div className="state">
        <h5>Values</h5>
        <pre>{JSON.stringify(props.form.values, null, 2)}</pre>
        <h5>Validation errors</h5>
        <pre>{JSON.stringify(props.form.validationErrors, null, 2)}</pre>
      </div>
    </div>
  ))
          `}
        />
        <p>This component would then be used like</p>
        <SyntaxHighlight
          code={`
  <ValidatedFormExample booleanProp={true} numberProp={5} />
          `}
        />
        <p>And here is a live example to play with</p>
        <ValidatedFormExample booleanProp={true} numberProp={5} />
      </section>

      {/*TODO*/}
      {/*<h2>Usage with external component libraries</h2>*/}
      {/*<h3>Material UI</h3>*/}

      {/*<h3>Office Fabric</h3>*/}
    </div>
  </DevErrorBoundary>
)
