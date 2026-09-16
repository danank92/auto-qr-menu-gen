"use client";
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Link as LinkIcon, Store, FileText } from 'lucide-react';

export default function Home() {
  const [restaurantName, setRestaurantName] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [theme, setTheme] = useState('#000000');
  
  const generateUrl = () => {
    if (!menuUrl) return 'https://example.com/menu';
    
    try {
      const url = new URL(menuUrl);
      if (tableNumber) {
        url.searchParams.append('table', tableNumber);
      }
      return url.toString();
    } catch (e) {
      return menuUrl;
    }
  };
  
  const finalUrl = generateUrl();
  const hasInput = menuUrl.length > 0;

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Add padding and background
      const padding = 20;
      canvas.width += padding * 2;
      canvas.height += padding * 2;
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
        
        // Add restaurant text if exists
        if (restaurantName) {
          canvas.height += 40;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
          ctx.fillStyle = theme;
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(restaurantName, canvas.width / 2, canvas.height - 15);
        }
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${restaurantName || 'restaurant'}-table-${tableNumber || 'menu'}-qr.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <QrCode className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            QR Menu Generator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create custom QR codes for your restaurant's digital menu
          </p>
        </div>

        <div className="mt-8 bg-white overflow-hidden shadow sm:rounded-lg flex flex-col md:flex-row">
          {/* Controls */}
          <div className="flex-1 px-4 py-5 sm:p-6 border-b md:border-b-0 md:border-r border-gray-200 space-y-6">
            
            <div>
              <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 flex items-center">
                <Store className="h-4 w-4 mr-2" />
                Restaurant Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="restaurant"
                  id="restaurant"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="The Fancy Fork"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="menu-url" className="block text-sm font-medium text-gray-700 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Menu URL (Required)
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="menu-url"
                  id="menu-url"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="https://your-website.com/menu"
                  value={menuUrl}
                  onChange={(e) => setMenuUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="table-number" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Table Number (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="table-number"
                    id="table-number"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="e.g., 12"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  QR Code Color
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    name="color"
                    id="color"
                    className="h-9 w-9 rounded-md border-0 p-0 cursor-pointer"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span className="text-sm text-gray-500 font-mono">{theme}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={downloadQR}
                disabled={!hasInput}
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${hasInput ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                <Download className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                Download QR Code Image
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-gray-50 p-8 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Preview</h3>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center transition-all duration-200 hover:shadow-md">
              <div className="mb-4 text-center min-h-[28px]">
                {restaurantName ? (
                  <h4 className="font-bold text-gray-800 text-xl" style={{ color: theme }}>{restaurantName}</h4>
                ) : (
                  <span className="text-gray-400 italic text-sm">Restaurant Name</span>
                )}
              </div>
              
              <div className="bg-white p-2">
                <QRCode
                  id="qr-code-svg"
                  value={finalUrl}
                  size={200}
                  fgColor={theme}
                  bgColor="#ffffff"
                  level="H"
                />
              </div>
              
              <div className="mt-4 text-center min-h-[24px]">
                {tableNumber ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Scan for Table {tableNumber}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Scan to view menu</span>
                )}
              </div>
            </div>
            
            <div className="mt-6 w-full px-4 text-center">
              <p className="text-xs text-gray-500 break-all">
                Points to: {hasInput ? finalUrl : 'Enter URL to generate'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Simple marketing footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>QR Menu Generator Micro-SaaS - Experiment 1</p>
        </div>
      </div>
    </div>
  );
}
