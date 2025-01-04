import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRateLimit = (actionType: string) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  const checkRateLimit = async () => {
    try {
      const { data: limits } = await supabase
        .from('rate_limited_actions')
        .select('*')
        .eq('action_type', actionType)
        .single();

      if (!limits) return true;

      const { data: auditLogs, error } = await supabase
        .from('audit_logs')
        .select('created_at')
        .eq('event_type', actionType)
        .gte('created_at', new Date(Date.now() - limits.window_minutes * 60000).toISOString())
        .limit(limits.max_requests + 1);

      if (error) throw error;

      const isLimited = (auditLogs?.length || 0) > limits.max_requests;
      setIsRateLimited(isLimited);

      if (isLimited) {
        toast({
          title: "Rate Limited",
          description: `Please wait before trying this action again.`,
          variant: "destructive",
        });
      }

      return !isLimited;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true;
    }
  };

  return { isRateLimited, checkRateLimit };
};