import React from 'react';
import { Leaf } from 'lucide-react';

export interface LogoProps extends React.HTMLAttributes<SVGElement> {}

export const Logo = React.forwardRef<SVGSVGElement, LogoProps>((props, ref) => (
  <Leaf {...props} ref={ref} />
));
Logo.displayName = 'Logo';
