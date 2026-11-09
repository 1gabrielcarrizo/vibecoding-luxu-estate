ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_properties_is_active ON public.properties(is_active);

