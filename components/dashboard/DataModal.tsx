"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Download, X, Waves } from "lucide-react"
import { DataModalProps } from "@/types/dashboard"
import { mockProfileData } from "@/lib/mock-data"

export const DataModal = ({ float, isOpen, onClose }: DataModalProps) => {
  if (!isOpen || !float) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-slate-200/50 p-6 flex-shrink-0">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Waves className="h-5 w-5 text-blue-600" />
              </div>
              Float {float.id} - Scientific Data Analysis
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Location: {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}° | Last Report:{" "}
              {float.lastReported.toLocaleDateString()}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full h-10 w-10 p-0 hover:bg-white/80"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto p-6 bg-white" style={{ maxHeight: 'calc(90vh - 8rem)' }}>
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl p-1 mb-6">
              <TabsTrigger value="profiles" className="rounded-lg">Depth Profiles</TabsTrigger>
              <TabsTrigger value="timeseries" className="rounded-lg">Time Series</TabsTrigger>
              <TabsTrigger value="tsdiagram" className="rounded-lg">T-S Diagram</TabsTrigger>
              <TabsTrigger value="crosssection" className="rounded-lg">Cross Section</TabsTrigger>
            </TabsList>

            <TabsContent value="profiles" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Temperature vs Depth */}
                <Card className="rounded-xl shadow-sm border-slate-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Temperature Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.temperature}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="value"
                            label={{ value: "Temperature (°C)", position: "insideBottom", offset: -10 }}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value}°C`, "Temperature"]} />
                          <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salinity vs Depth */}
                <Card className="rounded-xl shadow-sm border-slate-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Salinity Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.salinity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="value"
                            label={{ value: "Salinity (PSU)", position: "insideBottom", offset: -10 }}
                            domain={["dataMin - 0.1", "dataMax + 0.1"]}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value} PSU`, "Salinity"]} />
                          <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Pressure vs Depth */}
                <Card className="rounded-xl shadow-sm border-slate-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Pressure Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.temperature}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="pressure"
                            label={{ value: "Pressure (dbar)", position: "insideBottom", offset: -10 }}
                          />
                          <YAxis
                            dataKey="depth"
                            reversed
                            label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(1) : value} dbar`, "Pressure"]} />
                          <Line type="monotone" dataKey="pressure" stroke="#22c55e" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeseries" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temperature Time Series */}
                <Card className="rounded-xl shadow-sm border-slate-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Temperature Time Series</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.timeSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            label={{ value: "Date", position: "insideBottom", offset: -10 }}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            labelFormatter={(value) => `Date: ${value}`}
                            formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value}°C`, "Temperature"]}
                          />
                          <Line type="monotone" dataKey="temperature" stroke="#06b6d4" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salinity Time Series */}
                <Card className="rounded-xl shadow-sm border-slate-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Salinity Time Series</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProfileData.timeSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            label={{ value: "Date", position: "insideBottom", offset: -10 }}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis label={{ value: "Salinity (PSU)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            labelFormatter={(value) => `Date: ${value}`}
                            formatter={(value: number | string, name) => [`${typeof value === 'number' ? value.toFixed(2) : value} PSU`, "Salinity"]}
                          />
                          <Line type="monotone" dataKey="salinity" stroke="#eab308" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tsdiagram" className="mt-0">
              <Card className="rounded-xl shadow-sm border-slate-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">Temperature-Salinity Diagram</CardTitle>
                  <p className="text-xs text-slate-600">
                    Scatter plot showing the relationship between temperature and salinity at different depths
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={mockProfileData.tsDiagram}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="salinity"
                          label={{ value: "Salinity (PSU)", position: "insideBottom", offset: -10 }}
                          domain={["dataMin - 0.1", "dataMax + 0.1"]}
                        />
                        <YAxis
                          dataKey="temperature"
                          label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                          formatter={(value: number | string, name, props) => [
                            name === "temperature" ? 
                              `${typeof value === 'number' ? value.toFixed(2) : value}°C` : 
                              `${typeof value === 'number' ? value.toFixed(2) : value} PSU`,
                            name === "temperature" ? "Temperature" : "Salinity",
                          ]}
                          labelFormatter={(label, payload) =>
                            payload?.[0] ? `Depth: ${payload[0].payload.depth}m` : ""
                          }
                        />
                        <Scatter dataKey="temperature" fill="#06b6d4" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crosssection" className="mt-0">
              <Card className="rounded-xl shadow-sm border-slate-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">Latitude vs Depth Cross Section</CardTitle>
                  <p className="text-xs text-slate-600">Temperature distribution across latitudes and depths</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={mockProfileData.crossSection}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lat" label={{ value: "Latitude (°)", position: "insideBottom", offset: -10 }} />
                        <YAxis
                          dataKey="depth"
                          reversed
                          label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                          formatter={(value: number | string, name, props) => [`${typeof value === 'number' ? value.toFixed(1) : value}°C`, "Temperature"]}
                          labelFormatter={(label, payload) =>
                            payload?.[0] ? `Lat: ${payload[0].payload.lat}°, Depth: ${payload[0].payload.depth}m` : ""
                          }
                        />
                        <Scatter dataKey="temperature" fill="#06b6d4" fillOpacity={0.7} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export ASCII
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export NetCDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Plots
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
