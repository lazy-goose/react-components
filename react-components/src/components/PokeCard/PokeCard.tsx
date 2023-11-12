import { NavLink, useSearchParams } from 'react-router-dom';
import s from './PokeCard.module.scss';
import jcn from '../../utils/joinClassNames';

type PokeCardProps = {
  name: string;
  types: string[];
  imageUrl: string;
  imageAlt?: string;
  className?: string;
  active?: boolean;
};

export default function PokeCard(props: PokeCardProps) {
  const { name, types, imageUrl, imageAlt, className, active } = props;
  const [searchParams] = useSearchParams();
  return (
    <div
      className={jcn(s.PokeCard, active ? s.Active : null, className)}
      data-testid="pokemon-card"
    >
      <NavLink
        to={{ pathname: `pokemon/${name}`, search: searchParams.toString() }}
        className={s.LinkWrapper}
        data-testid="pokemon-card-link"
      >
        <div className={s.ImageContainer}>
          {imageUrl ? (
            <img
              className={s.Image}
              src={imageUrl}
              alt={imageAlt || `${name} pokemon`}
            />
          ) : (
            <div className={s.ImageFallbackBlock}>?</div>
          )}
        </div>
        <h3 className={s.Name}>{name}</h3>
        <p className={s.Types}>Types: {types.join(', ')}</p>
      </NavLink>
    </div>
  );
}
