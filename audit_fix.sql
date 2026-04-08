-- FIX: Change audit_logs.record_id from UUID to TEXT to support all table ID types
ALTER TABLE public.audit_logs ALTER COLUMN record_id SET DATA TYPE text;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS audit_trigger_orders ON public.orders;
DROP TRIGGER IF EXISTS audit_trigger_reservations ON public.reservations;

-- Drop function if it exists
DROP FUNCTION IF EXISTS public.audit_trigger_func();

-- Create new trigger function that handles TEXT record_id
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    table_name, 
    operation, 
    user_id, 
    record_id, 
    new_values
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id::text ELSE NEW.id::text END,
    to_jsonb(CASE WHEN TG_OP = 'DELETE' THEN OLD.* ELSE NEW.* END)
  );
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers for orders
CREATE TRIGGER audit_trigger_orders
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_func();

-- Recreate triggers for reservations  
CREATE TRIGGER audit_trigger_reservations
AFTER INSERT OR UPDATE OR DELETE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_func();
