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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-600" />
              Float {float.id} - Scientific Data Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Location: {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}° | Last Report:{" "}
              {float.lastReported.toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profiles">Depth Profiles</TabsTrigger>
              <TabsTrigger value="timeseries">Time Series</TabsTrigger>
              <TabsTrigger value="tsdiagram">T-S Diagram</TabsTrigger>
              <TabsTrigger value="crosssection">Cross Section</TabsTrigger>
            </TabsList>

            <TabsContent value="profiles" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Temperature vs Depth */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Temperature Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salinity Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pressure Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
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

            <TabsContent value="timeseries" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Temperature Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Temperature Time Series</CardTitle>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salinity Time Series</CardTitle>
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

            <TabsContent value="tsdiagram" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Temperature-Salinity Diagram</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Scatter plot showing the relationship between temperature and salinity at different depths
                  </p>
                </CardHeader>
                <CardContent>
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

            <TabsContent value="crosssection" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Latitude vs Depth Cross Section</CardTitle>
                  <p className="text-xs text-muted-foreground">Temperature distribution across latitudes and depths</p>
                </CardHeader>
                <CardContent>
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
