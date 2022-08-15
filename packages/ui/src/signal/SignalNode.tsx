import { Component, createEffect, For, JSX, ParentComponent, Show, splitProps } from "solid-js"
import { combineProps } from "@solid-primitives/props"
import { GraphSignal } from "@solid-devtools/shared/graph"
import { useHighlights, useSignalContext } from "../ctx/highlights"
import { createHover } from "@solid-aria/interactions"
import * as styles from "./SignalNode.css"
import { hexToRgb, theme } from "../theme"
import { EncodedPreview, ValueType } from "@solid-devtools/shared/serialize"

export const Signals: Component<{ each: GraphSignal[] }> = props => {
  return (
    <Show when={props.each.length}>
      <div class={styles.Signals.container}>
        <For each={props.each}>{signal => <SignalNode signal={signal} />}</For>
      </div>
    </Show>
  )
}

export const SignalNode: Component<{ signal: GraphSignal }> = ({ signal }) => {
  const { useUpdatedSelector } = useSignalContext()

  const isUpdated = useUpdatedSelector(signal.id)

  const { highlightSignalObservers, isSourceHighlighted } = useHighlights()
  const isHighlighted = isSourceHighlighted.bind(null, signal)

  const { hoverProps, isHovered } = createHover({})
  createEffect(() => highlightSignalObservers(signal, isHovered()))

  return (
    <div class={styles.SignalNode.container} {...hoverProps}>
      <div class={styles.SignalNode.name}>
        {signal.name}
        {/* <span class={styles.SignalNode.id}>#{signal.id}</span> */}
      </div>
      <ValuePreview encoded={signal.value()} updated={isUpdated()} highlighted={isHighlighted()} />
    </div>
  )
}

export const ValuePreview: Component<{
  updated?: boolean
  highlighted?: boolean
  encoded: EncodedPreview
}> = props => {
  return (
    <HighlightText
      strong={props.updated}
      light={props.highlighted}
      bgColor={theme.color.amber[400]}
      textColor
      class={styles.ValueNode}
    >
      {ValueType[props.encoded.type]}
    </HighlightText>
  )
}

export const HighlightText: ParentComponent<
  {
    textColor?: string | true
    bgColor?: string | true
    strong?: boolean
    light?: boolean
  } & JSX.HTMLAttributes<HTMLSpanElement>
> = props => {
  const bg = props.bgColor === true ? theme.color.cyan[400] : props.bgColor
  const color = props.textColor === true ? theme.color.black : props.textColor
  const bgStrong = bg ? hexToRgb(bg, 0.7) : null
  const bgLight = bg ? hexToRgb(bg, 0.4) : null
  const colorStrong = color ? hexToRgb(color, 0.7) : null
  const colorLight = color ? hexToRgb(color, 0.4) : null
  const [, attrs] = splitProps(props, ["textColor", "bgColor", "strong", "light"])
  return (
    <span
      {...combineProps(attrs, { class: styles.HighlightText.span })}
      style={{ color: props.strong ? colorStrong : props.light ? colorLight : null }}
    >
      <div
        class={styles.HighlightText.highlight}
        style={{ "background-color": props.strong ? bgStrong : props.light ? bgLight : null }}
      ></div>
      {props.children}
    </span>
  )
}
