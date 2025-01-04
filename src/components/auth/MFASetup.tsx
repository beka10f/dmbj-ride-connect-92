import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode.react';

export const MFASetup = () => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateMFASecret = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-mfa-secret');
      
      if (error) throw error;
      
      setSecret(data.secret);
      setQrCode(data.qrCode);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate MFA secret",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('verify-mfa-token', {
        body: { token: verificationCode, secret }
      });

      if (error) throw error;

      await supabase.from('profiles').update({
        mfa_enabled: true,
        mfa_secret: secret
      }).eq('id', (await supabase.auth.getUser()).data.user?.id);

      toast({
        title: "Success",
        description: "MFA has been enabled for your account",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify MFA token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Setup Two-Factor Authentication</h2>
        <p className="text-gray-500">Enhance your account security with 2FA</p>
      </div>

      {!secret ? (
        <Button
          onClick={generateMFASecret}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate QR Code"}
        </Button>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <QRCode value={qrCode} size={200} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verification">Verification Code</Label>
            <Input
              id="verification"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the 6-digit code"
            />
          </div>

          <Button
            onClick={verifyAndEnableMFA}
            disabled={loading || verificationCode.length !== 6}
            className="w-full"
          >
            {loading ? "Verifying..." : "Enable 2FA"}
          </Button>
        </div>
      )}
    </div>
  );
};