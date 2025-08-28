'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Smartphone, Monitor, Tablet, Globe, QrCode, Trash2, Shield } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  deviceId: string;
  isTrusted: boolean;
  lastUsed: string;
  ipAddress?: string;
  userAgent?: string;
}

interface DeviceManagementProps {
  userId: string;
}

export default function DeviceManagement({ userId }: DeviceManagementProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/auth/device/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerCurrentDevice = async () => {
    const deviceInfo = {
      name: getDeviceName(),
      type: getDeviceType(),
      deviceId: generateDeviceId(),
    };

    try {
      const response = await fetch('/api/auth/device/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify(deviceInfo),
      });

      if (response.ok) {
        toast.success('Device registered successfully!');
        fetchDevices();
      }
    } catch (error) {
      toast.error('Failed to register device');
    }
  };

  const verifyDevice = async (deviceId: string) => {
    try {
      const response = await fetch('/api/auth/device/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.isTrusted) {
          setQrCode(data.qrCode);
          setCurrentDevice(devices.find(d => d.deviceId === deviceId) || null);
          setShowQR(true);
        } else {
          toast.success('Device is already trusted!');
        }
      }
    } catch (error) {
      toast.error('Failed to verify device');
    }
  };

  const trustDevice = async (deviceId: string, token: string) => {
    try {
      const response = await fetch('/api/auth/device/trust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, token }),
      });

      if (response.ok) {
        toast.success('Device trusted successfully!');
        setShowQR(false);
        setQrCode('');
        setCurrentDevice(null);
        fetchDevices();
      }
    } catch (error) {
      toast.error('Failed to trust device');
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/device/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        toast.success('Device removed successfully!');
        fetchDevices();
      }
    } catch (error) {
      toast.error('Failed to remove device');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getDeviceName = () => {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'Mobile Device';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone/.test(userAgent)) {
      return 'mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const generateDeviceId = () => {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Device Management</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Device Management</h3>
        <button
          onClick={registerCurrentDevice}
          className="flex items-center space-x-2 text-primary-400 hover:text-primary-300"
        >
          <Shield className="w-4 h-4" />
          <span>Register This Device</span>
        </button>
      </div>

      {/* Device List */}
      <div className="space-y-4">
        {devices.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No devices registered</p>
            <p className="text-sm">Register this device to get started</p>
          </div>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="text-white font-medium">{device.name}</p>
                    <p className="text-gray-400 text-sm">
                      Last used: {formatDate(device.lastUsed)}
                    </p>
                    {device.ipAddress && (
                      <p className="text-gray-400 text-xs">IP: {device.ipAddress}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {device.isTrusted ? (
                    <span className="flex items-center space-x-1 text-green-400 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Trusted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => verifyDevice(device.deviceId)}
                      className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 text-sm"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Verify</span>
                    </button>
                  )}
                  <button
                    onClick={() => removeDevice(device.deviceId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && qrCode && currentDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="text-white font-semibold mb-4 text-center">
              Verify Device: {currentDevice.name}
            </h4>
            <div className="text-center">
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto mb-4 w-48 h-48 bg-white rounded-lg"
              />
              <p className="text-gray-300 text-sm mb-4">
                Scan this QR code with your mobile device to verify this device.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowQR(false);
                    setQrCode('');
                    setCurrentDevice(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
