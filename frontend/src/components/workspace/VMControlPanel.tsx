import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { VirtualMachine } from '@/types'
import { motion } from 'framer-motion'
import {
    AlertCircle,
    Cpu,
    HardDrive,
    Network,
    Pause,
    Play,
    Plus,
    RefreshCw,
    Server,
    Trash
} from 'lucide-react'
import React, { useState } from 'react'

interface VMControlPanelProps {
    vms: VirtualMachine[]
    onStart?: (vmId: string) => void
    onStop?: (vmId: string) => void
    onDelete?: (vmId: string) => void
    onRefresh?: () => void
    onCreateNew?: () => void
    className?: string
}

const VMControlPanel: React.FC<VMControlPanelProps> = ({
    vms,
    onStart,
    onStop,
    onDelete,
    onRefresh,
    onCreateNew,
    className
}) => {
    const [selectedVM, setSelectedVM] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleAction = async (action: 'start' | 'stop' | 'delete', vmId: string) => {
        setLoading(true)
        try {
            switch (action) {
                case 'start':
                    await onStart?.(vmId)
                    break
                case 'stop':
                    await onStop?.(vmId)
                    break
                case 'delete':
                    await onDelete?.(vmId)
                    break
            }
        } catch (error) {
            console.error('VM action failed:', error)
        }
        setLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return 'bg-green-500'
            case 'stopped':
                return 'bg-red-500'
            case 'starting':
            case 'stopping':
                return 'bg-yellow-500'
            default:
                return 'bg-gray-500'
        }
    }

    const formatMemory = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024)
        return `${gb.toFixed(1)} GB`
    }

    const formatStorage = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024)
        return `${gb.toFixed(0)} GB`
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Virtual Machines</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onRefresh}
                            className={loading ? 'animate-spin' : ''}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="sm" onClick={onCreateNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            New VM
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {vms.length === 0 ? (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No Virtual Machines</AlertTitle>
                            <AlertDescription>
                                Create a new virtual machine to get started.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        vms.map((vm) => (
                            <motion.div
                                key={vm.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{vm.name}</h3>
                                                    <Badge className={getStatusColor(vm.status)}>
                                                        {vm.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {vm.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {vm.status === 'stopped' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleAction('start', vm.id)}
                                                        disabled={loading}
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleAction('stop', vm.id)}
                                                        disabled={loading}
                                                    >
                                                        <Pause className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleAction('delete', vm.id)}
                                                    disabled={loading || vm.status !== 'stopped'}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">CPU Usage</span>
                                                    <span>{vm.metrics.cpu}%</span>
                                                </div>
                                                <Progress value={vm.metrics.cpu} className="h-1" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Memory Usage</span>
                                                    <span>
                                                        {formatMemory(vm.metrics.memoryUsed)} / {formatMemory(vm.metrics.memoryTotal)}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={(vm.metrics.memoryUsed / vm.metrics.memoryTotal) * 100}
                                                    className="h-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <HardDrive className="h-4 w-4" />
                                                    Storage
                                                </div>
                                                <div>{formatStorage(vm.metrics.storageTotal)}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Cpu className="h-4 w-4" />
                                                    CPU Cores
                                                </div>
                                                <div>{vm.specs.cpuCores}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Network className="h-4 w-4" />
                                                    Network
                                                </div>
                                                <div>{vm.network.ipAddress}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default VMControlPanel
