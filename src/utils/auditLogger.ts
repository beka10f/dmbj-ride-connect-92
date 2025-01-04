import { supabase } from "@/integrations/supabase/client";

export type AuditLogEvent = {
  event_type: 'auth' | 'data' | 'security' | 'error';
  action: string;
  details?: Record<string, any>;
  user_id?: string;
};

export const logAuditEvent = async (event: AuditLogEvent) => {
  try {
    console.log('Audit Log:', event);
    
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    const { error } = await supabase.functions.invoke('audit-log', {
      body: {
        ...event,
        user_id: event.user_id || userId,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('Audit logging error:', error);
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

// Helper functions for common audit events
export const auditAuth = (action: string, details?: Record<string, any>) => {
  return logAuditEvent({ event_type: 'auth', action, details });
};

export const auditData = (action: string, details?: Record<string, any>) => {
  return logAuditEvent({ event_type: 'data', action, details });
};

export const auditSecurity = (action: string, details?: Record<string, any>) => {
  return logAuditEvent({ event_type: 'security', action, details });
};

export const auditError = (action: string, details?: Record<string, any>) => {
  return logAuditEvent({ event_type: 'error', action, details });
};