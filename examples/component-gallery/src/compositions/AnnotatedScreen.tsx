import { useId } from 'react';

import { Card, type CardProps } from '../../../../components';

export type ScreenAnnotation = {
  detail: string;
  title: string;
};

export type AnnotatedScreenProps = {
  annotations: readonly ScreenAnnotation[];
  caption: string;
  surface?: CardProps['surface'];
  title: string;
  titleLevel?: 3 | 4;
};

export function AnnotatedScreen({
  annotations,
  caption,
  surface = 'default',
  title,
  titleLevel = 3,
}: AnnotatedScreenProps) {
  const captionId = useId();
  const TitleHeading = titleLevel === 4 ? 'h4' : 'h3';

  return (
    <Card
      as="article"
      className="rf-annotated-screen"
      data-gallery-composition="annotated-screen"
      data-gallery-surface={surface}
      data-teal-signal={surface === 'subtle-emphasis' ? 'persistent' : undefined}
      padding="spacious"
      surface={surface}
    >
      <TitleHeading>{title}</TitleHeading>
      <figure aria-labelledby={captionId}>
        <div aria-hidden="true" className="rf-annotated-screen__sample">
          <div className="rf-annotated-screen__sample-bar" />
          <div className="rf-annotated-screen__sample-layout">
            <div className="rf-annotated-screen__sample-nav" />
            <div className="rf-annotated-screen__sample-content">
              <div className="rf-annotated-screen__sample-line rf-annotated-screen__sample-line--short" />
              <div className="rf-annotated-screen__sample-panel" />
              <div className="rf-annotated-screen__sample-line" />
            </div>
          </div>
          {annotations.map((_, index) => (
            <span
              className={`rf-annotated-screen__marker rf-annotated-screen__marker--${index + 1}`}
              key={index}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <ol aria-label="Annotation details" className="rf-annotated-screen__notes">
          {annotations.map((annotation, index) => (
            <li key={annotation.title}>
              <span aria-label={`Annotation ${index + 1}`} className="rf-annotated-screen__note-number">
                {index + 1}
              </span>
              <span>
                <strong>{annotation.title}</strong>
                {annotation.detail}
              </span>
            </li>
          ))}
        </ol>
        <figcaption id={captionId}>{caption}</figcaption>
      </figure>
    </Card>
  );
}
