import { mapValues, pickBy, some } from 'lodash'
import {
  createElement,
  cloneElement,
  Component,
  ComponentType,
  EventHandler,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from 'react'
import {
  hasValidationErrors,
  FlatValidationResult,
  FlatValidator,
  valid,
  validate,
  Validator,
  ValueValidationResult,
} from 'composable-validation'

export function getValueFromEvent<I, O>(e: I): O
export function getValueFromEvent(e: any): any { // tslint:disable-line:no-any
  // support elements which just return their value
  if (!e || !e.target) {
    return e
  }

  return e.target.type === 'checkbox' ? e.target.checked : e.target.value
}

export type TODO = any // TODO remove

type Decorator<OwnProps, EnhancedProps> = (someComponent: ComponentType<EnhancedProps>) => ComponentType<OwnProps>

export type ControlEnhancer<Props> = (element: ReactElement<Props>) => ReactElement<Props>

export type ByFormKey<FormModel, T> = { [K in keyof FormModel]: T }

export type ControlProps<ValueType> = {
  onBlur?: (event?: TODO) => void,
  onChange?: (value: ValueType) => void,
  value?: ValueType,
}

export type FormProps<FormModel> = {
  form: {
    controlFor: { [K in keyof FormModel]: ControlEnhancer<ControlProps<FormModel[K]>> },
    hasValidationErrors: boolean,
    ifValid: (callback: (formModel: FormModel) => void) => void,
    setValues: (newValues: Partial<FormModel>) => void,
    submit: EventHandler<FormEvent<HTMLFormElement>> & MouseEventHandler<{}>,
    validationErrors: FlatValidationResult<FormModel>,
    values: FormModel,
  },
}

type FieldMeta = {
  errors: ValueValidationResult
  hasBlurred: boolean,
}
type FieldsMeta<FM> = ByFormKey<FM, FieldMeta>

type Config<FM, OP> = {
  initialValues: (ownProps: OP) => FM,
  validator?: (ownProps: OP) => (formState: FM) => FlatValidator<FM>,
  onSubmit: (ownProps: OP) => (formModel: FM) => void,
}

export const withForm = <OP, FM extends object>(config: Config<FM, OP>): Decorator<OP, OP & FormProps<FM>> =>
  (WrappedComponent: ComponentType<OP & FormProps<FM>>): ComponentType<OP> => {
    type FormWrapperState<FM> = { fieldMeta: FieldsMeta<FM>, values: FM }

    return class FormWrappedComponent extends Component<OP, FormWrapperState<FM>> {
      private cachedEventHandlers: Partial<ByFormKey<FM, { onBlur: TODO, onChange: (value: TODO) => void }>> = {}

      constructor(props: OP) {
        super(props)
        const values: FM = config.initialValues(props)
        const initialValidator: FlatValidator<FM> = (config.validator && config.validator(props)(values)) || {}
        const initialValidationResult: FlatValidationResult<FM> = validate(initialValidator, values);
        const fieldMeta = mapValues<FM, FieldMeta>(values, <K extends keyof FM>(value: FM[K], fieldName: TODO /*K*/): FieldMeta => ({
          errors: (initialValidationResult as TODO)[fieldName] as ValueValidationResult || [],
          hasBlurred: false,
        } as TODO)) as TODO

        this.state = {fieldMeta, values}
      }

      static displayName = `withForm(${WrappedComponent.displayName || WrappedComponent.name})`

      validationErrors = (fieldMeta: FieldsMeta<FM>): FlatValidationResult<FM> =>
        pickBy(
          mapValues(
            fieldMeta,
            (meta: FieldMeta): ValueValidationResult =>
              ((meta != null && meta.hasBlurred) ? (meta.errors) : valid),
          ),
          (errors) => errors && errors.length > 0
        )

      ifValid = (callbackIfValid: (formModel: FM) => void): void => {
        const validator: Validator<FM> | undefined = config.validator && config.validator(this.props)(this.state.values)
        const validationResult = validate((validator || {}) as TODO, this.state.values)
        if (!hasValidationErrors(validationResult)) {
          callbackIfValid(this.state.values)
        } else {
          // Mark all fields as blurred so that validation errors are shown
          this.setState((currentState) => ({
            fieldMeta: mapValues<FieldsMeta<FM>>(currentState.fieldMeta, ({errors}: FieldMeta): FieldMeta =>
              ({errors, hasBlurred: true})),
            values: currentState.values,
          }))
        }
      }


      onSubmit = (event: FormEvent<HTMLFormElement> & MouseEvent<{}>): void => {
        event.preventDefault()
        this.ifValid(config.onSubmit(this.props))
      }

      controlFor = (fieldName: keyof FM): ControlEnhancer<ControlProps<FM[keyof FM]>> => {
        if (this.cachedEventHandlers[fieldName] == null) {
          this.cachedEventHandlers[fieldName] = {
            // Typescript complains when using object spread on a generic type, use assign to work around.
            onBlur: (): TODO => this.setState(currentState => ({
              fieldMeta: Object.assign({}, currentState.fieldMeta, {
                [fieldName]: Object.assign({}, currentState.fieldMeta[fieldName], {hasBlurred: true}),
              }),
              values: currentState.values,
            })),
            onChange: (event: TODO): TODO => {
              const newValue = getValueFromEvent(event)
              this.setState(currentState => {
                const nextValues = Object.assign({}, currentState.values, {[fieldName]: newValue})
                const validatorInstance: Validator<FM> | undefined =
                  config.validator && config.validator(this.props)(nextValues)
                const validationResult: TODO = validate((validatorInstance || {}) as TODO, nextValues)
                const nextFieldMeta = mapValues(
                  currentState.fieldMeta,
                  (currentFieldMeta, keyFieldName: keyof FM) => Object.assign({}, currentFieldMeta, {
                    errors: validationResult[keyFieldName],
                  }),
                )

                return {
                  fieldMeta: nextFieldMeta,
                  values: nextValues,
                }
              })
            },
          }
        }

        const value: FM[keyof FM] = this.state.values[fieldName]
        const props: ControlProps<FM[keyof FM]> = Object.assign({}, this.cachedEventHandlers[fieldName], {
          value,
        })

        return (control: ReactElement<ControlProps<FM[keyof FM]>>): ReactElement<ControlProps<FM[keyof FM]>> => {
          const {onChange: existingOnChange, ...existingProps} = control.props
          const newOnChange = existingOnChange == null
            ? props.onChange
            : (fieldValue: FM[keyof FM]) => {
              existingOnChange(fieldValue)
              if (props.onChange != null) {
                props.onChange(fieldValue)
              }
            }

          const enhancedProps: ControlProps<FM[keyof FM]> = {...existingProps, ...props, onChange: newOnChange}

          return cloneElement<ControlProps<FM[keyof FM]>, ControlProps<FM[keyof FM]>>(control, enhancedProps)
        }
      }

      controlProxy = new Proxy<{ [K in keyof FM]: ControlEnhancer<ControlProps<FM[K]>> }>(
        {} as { [K in keyof FM]: ControlEnhancer<ControlProps<FM[K]>> },
        { get: (_, name: keyof FM) => this.controlFor(name) },
      )

      render(): ReactElement<OP & FormProps<FM>> {
        const hasUserVisibleValidationErrors = some(
          this.state.fieldMeta as object,
          (fm: FieldMeta) => fm.hasBlurred && fm.errors && fm.errors.length > 0,
        )

        const formProps: FormProps<FM> = {
          form: {
            controlFor: this.controlProxy as any,
            hasValidationErrors: hasUserVisibleValidationErrors,
            ifValid: this.ifValid,
            setValues: (values: Partial<FM>) => console.log(values), // TODO
            submit: this.onSubmit,
            validationErrors: this.validationErrors(this.state.fieldMeta),
            values: this.state.values,
          }
        }

        const enhancedProps: OP & FormProps<FM> = Object.assign({}, this.props, formProps)

        return createElement<OP & FormProps<FM>>(WrappedComponent, enhancedProps)
      }
    } as ComponentType<OP>
  }
